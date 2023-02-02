import "aframe";
import { Component, Entity, PropertyTypes, Scene, System } from "aframe";

type PropertyToData<T> = T extends "array"
  ? Array<string>
  : T extends "number" | "int"
  ? number
  : T extends "boolean"
  ? boolean
  : T extends "string"
  ? string
  : T extends "selectorAll"
  ? Array<any>
  : T extends "vec2"
  ? { x: number; y: number }
  : T extends "vec3"
  ? { x: number; y: number; z: number }
  : T extends "vec4"
  ? { x: number; y: number; z: number; w: number }
  : any;

// Multi-property Schema
interface MPSchema {
  [name: string]: { type: PropertyTypes };
}

// Single-property Schema
interface SPSchema {
  type: PropertyTypes;
}

type Schema = MPSchema | SPSchema;

export type SchemaData<S extends Schema> = S extends SPSchema
  ? PropertyToData<S["type"]>
  : S extends MPSchema
  ? {
      [P in keyof S]: PropertyToData<S[P]["type"]>;
    }
  : any;

export class TypedComponent<D, S extends Schema, SysD, SysS extends Schema> {
  name: string;
  desc: D & { schema: S };
  constructor(
    name: string,
    desc: D & { schema: S } & ThisType<
        D &
          Component<SchemaData<S>> & { system: System<SchemaData<SysS>> & SysD }
      >,
    system: TypedSystem<SysD, SysS> = null
  ) {
    this.name = name;
    this.desc = desc;
    AFRAME.registerComponent(name, desc);
  }
  isAttached(ent: Entity, id: string = null) {
    let name: string;
    if (id !== null) name = `${this.name}__${id}`;
    else name = this.name;
    return name in ent.components;
  }
  getFromEntity(ent: Entity, id: string = null) {
    let name: string;
    if (id !== null) name = `${this.name}__${id}`;
    else name = this.name;
    if (name in ent.components)
      return ent.components[name] as GetComponent<this>;
  }
  setComponentData(
    ent: Entity,
    data: Partial<SchemaData<S>>,
    id: string = null
  ) {
    if (id !== null) ent.setAttribute(`${this.name}__${id}`, data);
    else ent.setAttribute(this.name, data);
  }
  removeFromEntity(ent: Entity) {
    let component = this.getFromEntity(ent);
    if (!component) return; // We werent' attached arleady
    let id = component.id;
    if (id) ent.removeAttribute(`${component.name}__${id}`);
    else ent.removeAttribute(component.name);
  }
}

export type GetComponent<TC> = TC extends TypedComponent<
  infer D,
  infer S,
  infer SysD,
  infer SysS
>
  ? D & Component<SchemaData<S>> & { system: System<SchemaData<SysS>> & SysD }
  : never;

export type GetComponentData<TC> = TC extends TypedComponent<
  infer _D,
  infer S,
  infer _SysD,
  infer _SysS
>
  ? SchemaData<S>
  : never;

export class TypedSystem<D, S extends Schema> {
  name: string;
  desc: D & { schema: S };
  constructor(
    name: string,
    desc: D & { schema: S } & ThisType<D & System<SchemaData<S>>>
  ) {
    this.name = name;
    this.desc = desc;
    AFRAME.registerSystem(name, desc);
  }

  getFromScene(scene: Scene) {
    if (this.name in scene.systems)
      return scene.systems[this.name] as D & System<SchemaData<S>>;
  }
}
