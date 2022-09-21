import { InputFieldBuilder, InputFieldRef, SchemaTypes } from '@pothos/core';
import { PrismaModelTypes } from '@pothos/plugin-prisma';
import {
  PrismaUpdateFields,
  PrismaUpdateOptions,
  PrismaWhereFields,
  PrismaWhereOptions,
} from './types';

export class PrismaUpdateFieldBuilder<
  Types extends SchemaTypes,
  Model extends PrismaModelTypes,
> extends InputFieldBuilder<Types, 'InputObject'> {
  create<Fields extends PrismaUpdateFields<Types, Model>>(
    options: PrismaUpdateOptions<Types, Fields, Model>,
  ): InputFieldRef<{ Update: Fields }> {
    throw new Error('Not implemented');
  }

  connect<Fields extends PrismaWhereFields<Types, Model>>(
    options: PrismaWhereOptions<Types, Fields, Model>,
  ): InputFieldRef<{ connect: Fields }> {
    throw new Error('Not implemented');
  }
}
