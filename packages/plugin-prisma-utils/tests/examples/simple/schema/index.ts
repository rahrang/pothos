import { InputRef } from '@pothos/core';
import { Prisma } from '../../../client';
import builder, { prisma } from '../builder';

const StringFilter = builder.prismaFilter('String', {
  ops: ['contains', 'equals', 'startsWith', 'not', 'equals'],
});
export const IDFilter = builder.prismaFilter('Int', {
  ops: ['equals', 'not'],
});

const StringListFilter = builder.prismaListFilter(StringFilter, {
  ops: ['every', 'some', 'none'],
});

builder.scalarType('DateTime', {
  serialize: (value) => value.toISOString(),
  parseValue: (value) => (typeof value === 'number' ? new Date(value) : new Date(String(value))),
});

builder.queryType();

builder.queryField('post', (t) =>
  t.prismaField({
    type: 'Post',
    nullable: true,
    args: {
      title: t.arg({
        type: StringFilter,
      }),
      list: t.arg({ type: StringListFilter }),
    },
    resolve: (query, _, args) =>
      prisma.post.findFirst({
        where: {
          title: args.title ?? undefined,
          comments: {},
        },
      }),
  }),
);

builder.prismaObject('Post', {
  fields: (t) => ({
    id: t.exposeID('id'),
  }),
});

const ProfileOrderBy: InputRef<Prisma.ProfileOrderByWithRelationInput> = builder.prismaOrderBy(
  'Profile',
  {
    fields: () => ({
      bio: true,
      user: UserOrderBy,
    }),
  },
);

const UserOrderBy = builder.prismaOrderBy('User', {
  fields: {
    name: true,
    profile: ProfileOrderBy,
  },
});

export const PostOrderBy = builder.prismaOrderBy('Post', {
  fields: {
    id: true,
    title: true,
    createdAt: true,
    author: UserOrderBy,
  },
});

const CommentWhere = builder.prismaWhere('Comment', {
  fields: {
    createdAt: 'DateTime',
  },
});

const UserWhere = builder.prismaWhere('User', {
  fields: {
    id: IDFilter,
    NOT: true,
  },
});

const PostFilter = builder.prismaWhere('Post', {
  fields: (t) => ({
    id: IDFilter,
    title: 'String',
    createdAt: 'DateTime',
    author: UserWhere,
    comments: builder.prismaListFilter(CommentWhere, { ops: ['some'] }),
    authorId: t.field({ type: IDFilter, description: 'filter by author id' }),
  }),
});

const PostWhereUnique = builder.prismaWhere('Post', {
  name: 'PostWhereUnique',
  fields: (t) => ({
    id: 'Int',
  }),
});

builder.queryField('posts', (t) =>
  t.prismaField({
    type: ['Post'],
    args: { filter: t.arg({ type: PostFilter }), order: t.arg({ type: PostOrderBy }) },
    resolve: (query, _, args) =>
      prisma.post.findMany({
        ...query,
        where: args.filter ?? undefined,
        orderBy: args.order ?? undefined,
        take: 3,
      }),
  }),
);

builder.queryField('user', (t) =>
  t.prismaField({
    type: 'User',
    nullable: true,
    args: {
      input: t.arg({ type: UserCreate, required: true }),
    },
    resolve: (query, _, args) => prisma.user.create({ data: args.input }),
  }),
);

const UserCreate = builder.prismaCreate('User', {
  fields: (t) => ({
    name: t.string({ required: true }),
    email: t.string({ required: true }),
  }),
});

const CreatePostInput = builder.prismaCreate('Post', {
  fields: (t) => ({
    title: 'String',
    author: t.create('author', UserCreate),
    content: {
      type: 'String',
    },
  }),
});

const UpdatePostInput = builder.prismaUpdate('Post', {
  fields: (t) => ({
    title: 'String',
    content: {
      type: 'String',
    },
  }),
});

builder.mutationField('createPost', (t) =>
  t.prismaField({
    type: 'Post',
    args: {
      data: t.arg({ type: CreatePostInput, required: true }),
    },
    resolve: (query, _, args) =>
      prisma.post.create({
        ...query,
        data: args.data,
      }),
  }),
);

builder.mutationField('updatePost', (t) =>
  t.prismaField({
    type: 'Post',
    args: {
      where: t.arg({ type: PostWhereUnique, required: true }),
      data: t.arg({ type: UpdatePostInput, required: true }),
    },
    resolve: (query, _, args) =>
      prisma.post.update({
        where: args.where,
        ...query,
        data: args.data,
      }),
  }),
);

export default builder.toSchema();
