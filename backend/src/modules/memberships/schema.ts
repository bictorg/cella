import { z } from 'zod';

import { createSelectSchema } from 'drizzle-zod';
import { membershipsTable } from '../../db/schema/memberships';
import { contextEntityTypeSchema, idOrSlugSchema, idSchema, idsQuerySchema } from '../../lib/common-schemas';
import { userSchema } from '../users/schema';
import { i18n } from '../../lib/i18n';

const membershipTableSchema = createSelectSchema(membershipsTable);

export const membershipSchema = membershipTableSchema.extend({
  inactive: z.boolean(),
  muted: z.boolean(),
  createdAt: z.string(),
  modifiedAt: z.string().nullable(),
});

export const createMembershipBodySchema = z.object({
  emails: userSchema.shape.email.array().min(1, { message: i18n.t('backend:invalid.min_items', { items_count: 'one', item: 'email' }) }),
  role: membershipSchema.shape.role,
});

export const updateMembershipBodySchema = z.object({
  role: membershipTableSchema.shape.role.optional(),
  muted: z.boolean().optional(),
  inactive: z.boolean().optional(),
  order: z.number().optional(),
});

const baseMembersQuerySchema = z.object({
  idOrSlug: idOrSlugSchema,
  entityType: contextEntityTypeSchema,
});

export const createMembershipQuerySchema = baseMembersQuerySchema.extend({ organizationId: idSchema });

export const deleteMembersQuerySchema = baseMembersQuerySchema.extend(idsQuerySchema.shape);

export const membershipInfoSchema = z.object({
  id: membershipTableSchema.shape.id,
  role: membershipTableSchema.shape.role,
  archived: membershipTableSchema.shape.inactive,
  muted: membershipTableSchema.shape.muted,
  order: membershipTableSchema.shape.order,
});

export type membershipInfoType = z.infer<typeof membershipInfoSchema>;
