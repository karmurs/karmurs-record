import argparse
import math
import sys
from pathlib import Path

import bpy
from mathutils import Vector


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()


def import_model(source_path: Path):
    bpy.ops.import_scene.gltf(filepath=str(source_path))
    meshes = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]
    if not meshes:
      raise RuntimeError(f"No mesh objects were imported from {source_path}")
    return meshes


def scene_bounds(objects):
    min_corner = Vector((float("inf"), float("inf"), float("inf")))
    max_corner = Vector((float("-inf"), float("-inf"), float("-inf")))

    for obj in objects:
        for corner in obj.bound_box:
            world = obj.matrix_world @ Vector(corner)
            min_corner.x = min(min_corner.x, world.x)
            min_corner.y = min(min_corner.y, world.y)
            min_corner.z = min(min_corner.z, world.z)
            max_corner.x = max(max_corner.x, world.x)
            max_corner.y = max(max_corner.y, world.y)
            max_corner.z = max(max_corner.z, world.z)

    return min_corner, max_corner


def center_model(objects):
    min_corner, max_corner = scene_bounds(objects)
    center = (min_corner + max_corner) / 2
    for obj in objects:
        obj.location.x -= center.x
        obj.location.y -= center.y
        obj.location.z -= min_corner.z
    return scene_bounds(objects)


def rotate_model(objects, degrees):
    if degrees == 0:
        return scene_bounds(objects)

    radians = math.radians(degrees)
    for obj in objects:
        obj.rotation_euler.z += radians
    bpy.context.view_layer.update()
    return scene_bounds(objects)


def add_studio_lighting(bounds):
    min_corner, max_corner = bounds
    size = max((max_corner - min_corner).x, (max_corner - min_corner).y)

    bpy.context.scene.world = bpy.data.worlds.new("soft black world")
    bpy.context.scene.world.color = (0.015, 0.016, 0.015)

    lights = [
        ("top softbox", (0.0, 0.0, size * 2.0), 850, size * 1.35, (1.0, 0.96, 0.88)),
        ("left strip reflection", (-size * 0.72, 0.0, size * 1.25), 420, size * 0.75, (0.88, 0.94, 1.0)),
        ("right strip reflection", (size * 0.72, 0.0, size * 1.05), 260, size * 0.62, (1.0, 0.92, 0.82)),
    ]

    for name, location, energy, light_size, color in lights:
        bpy.ops.object.light_add(type="AREA", location=location)
        light = bpy.context.object
        light.name = name
        light.data.energy = energy
        light.data.size = light_size
        light.data.color = color


def add_camera(bounds, resolution_x, resolution_y, padding):
    min_corner, max_corner = bounds
    size = max_corner - min_corner
    aspect = resolution_x / resolution_y
    vertical_scale = max(size.y * padding, (size.x * padding) / aspect)
    camera_z = max_corner.z + max(size.x, size.y) * 2.6

    bpy.ops.object.camera_add(location=(0, 0, camera_z), rotation=(0, 0, 0))
    camera = bpy.context.object
    camera.name = "setup top-view camera"
    camera.data.type = "ORTHO"
    camera.data.ortho_scale = vertical_scale
    bpy.context.scene.camera = camera


def configure_render(output_path: Path, resolution_x: int, resolution_y: int, samples: int):
    bpy.context.scene.render.engine = "CYCLES"
    bpy.context.scene.cycles.samples = samples
    bpy.context.scene.cycles.use_denoising = True
    bpy.context.scene.render.resolution_x = resolution_x
    bpy.context.scene.render.resolution_y = resolution_y
    bpy.context.scene.render.film_transparent = True
    bpy.context.scene.view_settings.view_transform = "Filmic"
    bpy.context.scene.view_settings.look = "Medium High Contrast"
    bpy.context.scene.view_settings.exposure = 0
    bpy.context.scene.view_settings.gamma = 1
    bpy.context.scene.render.filepath = str(output_path)


def render(
    source_path: Path,
    output_path: Path,
    resolution_x: int,
    resolution_y: int,
    samples: int,
    padding: float,
    rotate_z: float,
):
    output_path.parent.mkdir(parents=True, exist_ok=True)
    clear_scene()
    meshes = import_model(source_path)
    center_model(meshes)
    bounds = rotate_model(meshes, rotate_z)
    add_studio_lighting(bounds)
    add_camera(bounds, resolution_x, resolution_y, padding)
    configure_render(output_path, resolution_x, resolution_y, samples)
    bpy.ops.render.render(write_still=True)


def main():
    parser = argparse.ArgumentParser(description="Render a top-view setup car PNG from a GLB model.")
    parser.add_argument("--source", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--resolution-x", default=1400, type=int)
    parser.add_argument("--resolution-y", default=2200, type=int)
    parser.add_argument("--samples", default=160, type=int)
    parser.add_argument("--padding", default=1.12, type=float)
    parser.add_argument("--rotate-z", default=0, type=float)
    script_args = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else sys.argv[1:]
    args = parser.parse_args(script_args)

    render(
        Path(args.source).resolve(),
        Path(args.output).resolve(),
        args.resolution_x,
        args.resolution_y,
        args.samples,
        args.padding,
        args.rotate_z,
    )


if __name__ == "__main__":
    main()
