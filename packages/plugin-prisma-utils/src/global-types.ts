import { InputRef, InputShapeFromTypeParam, InputType, SchemaTypes } from '@pothos/core';
import { PrismaModelTypes } from '@pothos/plugin-prisma';
import {
  FilterListOps,
  FilterOps,
  FilterShape,
  OpsOptions,
  PrismaCreateFields,
  PrismaCreateOptions,
  PrismaFilterOptions,
  PrismaListFilterOptions,
  PrismaOrderByOptions,
  PrismaShapeFromInputFields,
  PrismaUpdateFields,
  PrismaUpdateOptions,
  PrismaWhereFields,
  PrismaWhereOptions,
} from './types';

import type { PrismaUtilsPlugin } from '.';

declare global {
  export namespace PothosSchemaTypes {
    export interface Plugins<Types extends SchemaTypes> {
      prismaUtils: PrismaUtilsPlugin<Types>;
    }

    export interface SchemaBuilder<Types extends SchemaTypes> {
      prismaListFilter: <
        Type extends InputType<Types>,
        Ops extends OpsOptions<Types, Type, FilterListOps>,
      >(
        type: Type,
        options: PrismaListFilterOptions<Types, Type, Ops>,
      ) => InputRef<{
        [K in Ops extends string[] ? Ops[number] : keyof Ops]: InputShapeFromTypeParam<
          Types,
          Type,
          true
        >;
      }>;
      prismaFilter: <Type extends InputType<Types>, Ops extends OpsOptions<Types, Type, FilterOps>>(
        type: Type,
        options: PrismaFilterOptions<Types, Type, Ops>,
      ) => InputRef<
        Pick<
          FilterShape<InputShapeFromTypeParam<Types, Type, true>>,
          Ops extends readonly string[] ? Ops[number] : keyof Ops
        >
      >;

      prismaOrderBy: <
        Name extends keyof Types['PrismaTypes'],
        Model extends PrismaModelTypes = Types['PrismaTypes'][Name] extends PrismaModelTypes
          ? Types['PrismaTypes'][Name]
          : never,
      >(
        name: Name,
        options: PrismaOrderByOptions<Types, Model>,
      ) => InputRef<Model['OrderBy']>;

      orderByEnum: () => EnumRef<'asc' | 'desc'>;

      prismaWhere: <
        Name extends keyof Types['PrismaTypes'],
        Fields extends PrismaWhereFields<Types, Model>,
        Model extends PrismaModelTypes = Types['PrismaTypes'][Name] extends PrismaModelTypes
          ? Types['PrismaTypes'][Name]
          : never,
      >(
        type: Name,
        options: PrismaWhereOptions<Types, Fields, Model>,
      ) => InputRef<PrismaShapeFromInputFields<Fields, undefined>>;

      prismaCreate: <
        Name extends keyof Types['PrismaTypes'],
        Fields extends PrismaCreateFields<Types, Model>,
        Model extends PrismaModelTypes = Types['PrismaTypes'][Name] extends PrismaModelTypes
          ? Types['PrismaTypes'][Name]
          : never,
      >(
        type: Name,
        options: PrismaCreateOptions<Types, Fields, Model>,
      ) => InputRef<PrismaShapeFromInputFields<Fields>>;

      prismaUpdate: <
        Name extends keyof Types['PrismaTypes'],
        Fields extends PrismaUpdateFields<Types, Model>,
        Model extends PrismaModelTypes = Types['PrismaTypes'][Name] extends PrismaModelTypes
          ? Types['PrismaTypes'][Name]
          : never,
      >(
        type: Name,
        options: PrismaUpdateOptions<Types, Fields, Model>,
      ) => InputRef<PrismaShapeFromInputFields<Fields, null | undefined>>;
    }
  }
}
