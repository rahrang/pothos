// Type map: https://github.com/prisma/prisma/blob/main/packages/client/src/runtime/utils/common.ts#L63

import type {
  BaseEnum,
  InputFieldMap,
  InputFieldRef,
  InputRef,
  InputType,
  SchemaTypes,
} from '@pothos/core';
import type { PrismaModelTypes } from '@pothos/plugin-prisma';
import type { PrismaCreateFieldBuilder } from './create';
import type { PrismaUpdateFieldBuilder } from './update';

export type FilterListOps = 'every' | 'some' | 'none';

export interface FilterShape<T> {
  equals?: T;
  in?: T[];
  notIn?: T[];
  lt?: T;
  lte?: T;
  gt?: T;
  gte?: T;
  not?: FilterShape<T>;
  contains?: T;
  startsWith?: T;
  endsWith?: T;
  is?: T;
  isNot?: T;
  search?: T;
}

export type FilterOps = keyof FilterShape<unknown>;

export type PrismaOrderByFields<Types extends SchemaTypes, Model extends PrismaModelTypes> = {
  [K in keyof Model['OrderBy'] as K extends Model['ListRelations']
    ? never
    : K]?: K extends Model['RelationName']
    ?
        | InputRef<Model['Relations'][K]['Types']['OrderBy']>
        | (() => PothosSchemaTypes.InputFieldOptions<
            Types,
            InputRef<Model['Relations'][K]['Types']['OrderBy']>
          >)
    : boolean | (() => Omit<PothosSchemaTypes.InputFieldOptions<Types>, 'type'>);
};

export interface PrismaOrderByOptions<Types extends SchemaTypes, Model extends PrismaModelTypes>
  extends Omit<PothosSchemaTypes.InputObjectTypeOptions<Types, InputFieldMap>, 'fields'> {
  name?: string;
  fields: PrismaOrderByFields<Types, Model> | (() => PrismaOrderByFields<Types, Model>);
}

export interface PrismaWhereOptions<
  Types extends SchemaTypes,
  Fields extends PrismaWhereFields<Types, Model>,
  Model extends PrismaModelTypes,
> extends Omit<PothosSchemaTypes.InputObjectTypeOptions<Types, InputFieldMap>, 'fields'> {
  name?: string;
  fields: Fields | ((t: PrismaUpdateFieldBuilder<Types, Model>) => Fields);
}

export type PrismaWhereFields<Types extends SchemaTypes, Model extends PrismaModelTypes> = {
  [K in keyof Model['Where']]?: K extends 'AND' | 'OR'
    ? boolean | Omit<PothosSchemaTypes.InputFieldOptions<Types, InputRef<Model['Where'][]>>, 'type'>
    : K extends 'NOT'
    ? boolean | Omit<PothosSchemaTypes.InputFieldOptions<Types, InputRef<Model['Where']>>, 'type'>
    : PrismaWhereFieldType<Types, Model, K>;
};

export interface PrismaWhereFieldOptions<
  Types extends SchemaTypes,
  Model extends PrismaModelTypes,
  K extends keyof Model['Where'],
> extends Omit<PothosSchemaTypes.InputFieldOptions<Types, InputRef<Model['Where'][K]>>, 'type'> {
  type: PrismaWhereFieldType<Types, Model, K>;
}

export type PrismaWhereFieldType<
  Types extends SchemaTypes,
  Model extends PrismaModelTypes,
  K extends keyof Model['Where'],
> = K extends Model['RelationName']
  ? InputRef<Model['Where'][K]> | InputFieldRef<Model['Where'][K]>
  :
      | InputWithShape<Types, Model['Shape'][K]>
      | InputRef<Model['Where'][K]>
      | InputFieldRef<Model['Where'][K] | null | undefined>;

export interface PrismaCreateOptions<
  Types extends SchemaTypes,
  Fields extends PrismaCreateFields<Types, Model>,
  Model extends PrismaModelTypes,
> extends Omit<PothosSchemaTypes.InputObjectTypeOptions<Types, InputFieldMap>, 'fields'> {
  name?: string;
  fields: Fields | ((t: PrismaCreateFieldBuilder<Types, Model>) => Fields);
}

export type PrismaCreateFields<Types extends SchemaTypes, Model extends PrismaModelTypes> = {
  [K in keyof Model['Create']]?: K extends Model['RelationName']
    ? InputRef<Model['Create'][K]> | InputFieldRef<Model['Create'][K]>
    : PrismaCreateFieldType<Types, Model, K>;
};

export interface PrismaCreateFieldOptions<
  Types extends SchemaTypes,
  Model extends PrismaModelTypes,
  K extends keyof Model['Create'],
> extends Omit<PothosSchemaTypes.InputFieldOptions<Types, InputRef<Model['Create'][K]>>, 'type'> {
  type: PrismaCreateFieldType<Types, Model, K>;
}

export type PrismaCreateFieldType<
  Types extends SchemaTypes,
  Model extends PrismaModelTypes,
  K extends keyof Model['Create'],
> = K extends Model['RelationName']
  ? InputRef<Model['Create'][K]> | InputFieldRef<Model['Create'][K]>
  :
      | InputWithShape<Types, Model['Shape'][K]>
      | InputRef<Model['Create'][K]>
      | InputFieldRef<Model['Create'][K]>;

export interface PrismaUpdateOptions<
  Types extends SchemaTypes,
  Fields extends PrismaUpdateFields<Types, Model>,
  Model extends PrismaModelTypes,
> extends Omit<PothosSchemaTypes.InputObjectTypeOptions<Types, InputFieldMap>, 'fields'> {
  name?: string;
  fields: Fields | ((t: PothosSchemaTypes.InputFieldBuilder<Types, 'InputObject'>) => Fields);
}

export type PrismaUpdateFields<Types extends SchemaTypes, Model extends PrismaModelTypes> = {
  [K in keyof Model['Update']]?: K extends Model['RelationName']
    ? PrismaUpdateFieldType<Types, Model, K>
    : PrismaUpdateFieldType<Types, Model, K>;
};

export interface PrismaUpdateFieldOptions<
  Types extends SchemaTypes,
  Model extends PrismaModelTypes,
  K extends keyof Model['Update'],
> extends Omit<PothosSchemaTypes.InputFieldOptions<Types, InputRef<Model['Update'][K]>>, 'type'> {
  type: PrismaUpdateFieldType<Types, Model, K>;
}

export type PrismaUpdateFieldType<
  Types extends SchemaTypes,
  Model extends PrismaModelTypes,
  K extends keyof Model['Update'],
> = K extends Model['RelationName']
  ? InputRef<Model['Update'][K]> | InputFieldRef<Model['Update'][K]>
  :
      | InputWithShape<Types, Model['Shape'][K]>
      | InputRef<Model['Update'][K]>
      | InputFieldRef<Model['Update'][K]>;

type InputWithShape<Types extends SchemaTypes, T> =
  | InputRef<T>
  | InputFieldRef<T | null | undefined>
  | (BaseEnum & Record<string, T>)
  | (new (...args: any[]) => T)
  | (keyof Types['inputShapes'] extends infer U extends string
      ? U extends string
        ? Types['inputShapes'][U & keyof Types['inputShapes']] extends T
          ? U
          : never
        : never
      : never);

export type OpsOptions<
  Types extends SchemaTypes,
  Type extends InputType<Types>,
  Ops extends string,
> = readonly Ops[] | Record<Ops, Omit<PothosSchemaTypes.InputFieldOptions<Types, Type>, 'type'>>;

export interface PrismaFilterOptions<
  Types extends SchemaTypes,
  Type extends InputType<Types>,
  Ops extends OpsOptions<Types, Type, FilterOps>,
> extends Omit<PothosSchemaTypes.InputObjectTypeOptions<Types, InputFieldMap>, 'fields'> {
  name?: string;
  ops: Ops;
}

export interface PrismaListFilterOptions<
  Types extends SchemaTypes,
  Type extends InputType<Types>,
  Ops extends OpsOptions<Types, Type, FilterListOps>,
> extends Omit<PothosSchemaTypes.InputObjectTypeOptions<Types, InputFieldMap>, 'fields'> {
  name?: string;
  ops: Ops;
}

export type PrismaShapeFromInputFields<Fields, Nulls = undefined> = {
  [K in keyof Fields]: Fields[K] extends InputRef<infer T>
    ? NormalizeNulls<T, Nulls>
    : Fields[K] extends InputFieldRef<infer T>
    ? NormalizeNulls<T, Nulls>
    : never;
};

export type NormalizeNulls<T, Nulls> = undefined extends T
  ? NonNullable<T> | Nulls
  : NonNullable<T>;
