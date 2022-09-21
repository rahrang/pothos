import { InputFieldBuilder, InputFieldRef, InputRef, SchemaTypes } from '@pothos/core';
import { PrismaModelTypes } from '@pothos/plugin-prisma';
import {
  PrismaCreateFields,
  PrismaCreateOptions,
  PrismaWhereFields,
  PrismaWhereOptions,
} from './types';

export class PrismaCreateFieldBuilder<
  Types extends SchemaTypes,
  Model extends PrismaModelTypes,
> extends InputFieldBuilder<Types, 'InputObject'> {
  create<
    Relation extends Model['RelationName'] & keyof Model['Create'],
    Fields extends PrismaCreateFields<Types, Model['Relations'][Relation]['Types']>,
  >(
    relation: Relation,
    options:
      | PrismaCreateOptions<
          Types,
          Fields,
          Model['Relations'][Relation]['Types']['Create'] & PrismaModelTypes
        >
      | InputRef<Model['Create'][Relation] extends { create?: infer T } ? T : never>,
  ): InputFieldRef<Model['Create'][Relation]> {
    throw new Error('Not implemented');
  }

  connect<
    Relation extends Model['RelationName'] & keyof Model['Create'],
    Fields extends PrismaWhereFields<Types, Model['Relations'][Relation]['Types']>,
  >(
    relation: Relation,
    options: PrismaWhereOptions<Types, Fields, Model['Relations'][Relation]['Types']>,
  ): InputFieldRef<Model['Create'][Relation]> {
    throw new Error('Not implemented');
  }
}
