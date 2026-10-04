#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/7bb539b94b45fe5d43f5f04e62d5dce83c08587ad76fee07aff5b1504db4f6c3/contract';
import endContract from '../../snapshots/7bb539b94b45fe5d43f5f04e62d5dce83c08587ad76fee07aff5b1504db4f6c3/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'Address',
        columns: [
          col('addressLine1', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('addressLine2', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('city', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('country', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('fullName', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('isDefault', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('phone', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('pincode', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('state', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('userId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Attribute',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('slug', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'AttributeValue',
        columns: [
          col('attributeId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('slug', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('value', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Category',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('parentId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('slug', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('sortOrder', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('status', 'text', {
            notNull: true,
            default: lit('ACTIVE'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'Category_status_check_6a6f42a1',
            "\"status\" IN ('ACTIVE', 'INACTIVE', 'ARCHIVED')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'OtpVerification',
        columns: [
          col('attempts', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('expiresAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('identifier', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('otpHash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('purpose', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('verifiedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'OtpVerification_purpose_check_1ddd8498',
            "\"purpose\" IN ('SIGNUP', 'LOGIN', 'PASSWORD_RESET')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'Product',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('isCustomizable', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('slug', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('sortOrder', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('status', 'text', {
            notNull: true,
            default: lit('DRAFT'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'Product_status_check_ab8518c2',
            "\"status\" IN ('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'ProductAttribute',
        columns: [
          col('attributeValueId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('productId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'ProductCategoryLink',
        columns: [
          col('categoryId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('productId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['productId', 'categoryId'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'ProductMedia',
        columns: [
          col('altText', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('attributeValueId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('isPrimary', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('metadata', 'json', { codecRef: { codecId: 'pg/json@1' } }),
          col('productId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('sortOrder', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('storageKey', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('type', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('url', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'ProductMedia_type_check_f5e8ba99',
            "\"type\" IN ('IMAGE', 'VIDEO', 'MODEL_3D')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'ProductVariant',
        columns: [
          col('compareAtPrice', 'numeric(10,2)', {
            codecRef: { codecId: 'pg/numeric@1', typeParams: { precision: 10, scale: 2 } },
          }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('isActive', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('name', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('price', 'numeric(10,2)', {
            notNull: true,
            codecRef: { codecId: 'pg/numeric@1', typeParams: { precision: 10, scale: 2 } },
          }),
          col('productId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('sku', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('sortOrder', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('weight', 'numeric(10,3)', {
            codecRef: { codecId: 'pg/numeric@1', typeParams: { precision: 10, scale: 3 } },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'SignupAttempt',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('email', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('expiresAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('passwordHash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('phone', 'text', { codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'User',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('email', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('passwordHash', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('phone', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('role', 'text', {
            notNull: true,
            default: lit('CUSTOMER'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('status', 'text', {
            notNull: true,
            default: lit('ACTIVE'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression('User_role_check_f77ed390', "\"role\" IN ('CUSTOMER', 'OWNER')"),
          checkExpression(
            'User_status_check_b93c425b',
            "\"status\" IN ('ACTIVE', 'SUSPENDED', 'INACTIVE')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'UserIdentity',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('provider', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('providerAccountId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('userId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression('UserIdentity_provider_check_ced8a431', '"provider" IN (\'GOOGLE\')'),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'UserSession',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('expiresAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('lastUsedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('refreshTokenHash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('revokedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('userId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'VariantAttribute',
        columns: [
          col('attributeValueId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('variantId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Attribute',
        constraint: 'Attribute_slug_key',
        columns: ['slug'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'AttributeValue',
        constraint: 'AttributeValue_attributeId_slug_key',
        columns: ['attributeId', 'slug'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Category',
        constraint: 'Category_slug_key',
        columns: ['slug'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Product',
        constraint: 'Product_slug_key',
        columns: ['slug'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'ProductAttribute',
        constraint: 'ProductAttribute_productId_attributeValueId_key',
        columns: ['productId', 'attributeValueId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'ProductVariant',
        constraint: 'ProductVariant_sku_key',
        columns: ['sku'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'User',
        constraint: 'User_email_key',
        columns: ['email'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'User',
        constraint: 'User_phone_key',
        columns: ['phone'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'UserIdentity',
        constraint: 'UserIdentity_provider_providerAccountId_key',
        columns: ['provider', 'providerAccountId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'UserSession',
        constraint: 'UserSession_refreshTokenHash_key',
        columns: ['refreshTokenHash'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'VariantAttribute',
        constraint: 'VariantAttribute_variantId_attributeValueId_key',
        columns: ['variantId', 'attributeValueId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Address',
        index: 'Address_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'AttributeValue',
        index: 'AttributeValue_attributeId_idx_58ec5fae',
        columns: ['attributeId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Category',
        index: 'Category_parentId_idx_6a68f597',
        columns: ['parentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Category',
        index: 'Category_status_sortOrder_idx_f274e6a2',
        columns: ['status', 'sortOrder'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'OtpVerification',
        index: 'OtpVerification_identifier_purpose_idx_ad25fed6',
        columns: ['identifier', 'purpose'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Product',
        index: 'Product_status_sortOrder_idx_f274e6a2',
        columns: ['status', 'sortOrder'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ProductAttribute',
        index: 'ProductAttribute_attributeValueId_idx_3b32dbec',
        columns: ['attributeValueId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ProductAttribute',
        index: 'ProductAttribute_productId_idx_5858600a',
        columns: ['productId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ProductCategoryLink',
        index: 'ProductCategoryLink_categoryId_idx_15c304f2',
        columns: ['categoryId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ProductCategoryLink',
        index: 'ProductCategoryLink_productId_idx_5858600a',
        columns: ['productId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ProductMedia',
        index: 'ProductMedia_attributeValueId_idx_3b32dbec',
        columns: ['attributeValueId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ProductMedia',
        index: 'ProductMedia_attributeValueId_sortOrder_idx_ba43364c',
        columns: ['attributeValueId', 'sortOrder'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ProductMedia',
        index: 'ProductMedia_productId_attributeValueId_idx_32d29b36',
        columns: ['productId', 'attributeValueId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ProductMedia',
        index: 'ProductMedia_productId_idx_5858600a',
        columns: ['productId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ProductMedia',
        index: 'ProductMedia_productId_type_idx_716965fd',
        columns: ['productId', 'type'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ProductVariant',
        index: 'ProductVariant_productId_idx_5858600a',
        columns: ['productId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ProductVariant',
        index: 'ProductVariant_productId_isActive_sortOrder_idx_f47dc400',
        columns: ['productId', 'isActive', 'sortOrder'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'SignupAttempt',
        index: 'SignupAttempt_email_idx_46df9cad',
        columns: ['email'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'SignupAttempt',
        index: 'SignupAttempt_phone_idx_8db23f45',
        columns: ['phone'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'UserIdentity',
        index: 'UserIdentity_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'UserSession',
        index: 'UserSession_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'VariantAttribute',
        index: 'VariantAttribute_attributeValueId_idx_3b32dbec',
        columns: ['attributeValueId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'VariantAttribute',
        index: 'VariantAttribute_variantId_idx_e16bb45d',
        columns: ['variantId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Address',
        foreignKey: {
          name: 'Address_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'AttributeValue',
        foreignKey: {
          name: 'AttributeValue_attributeId_fkey',
          columns: ['attributeId'],
          references: { schema: 'public', table: 'Attribute', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Category',
        foreignKey: {
          name: 'Category_parentId_fkey',
          columns: ['parentId'],
          references: { schema: 'public', table: 'Category', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ProductAttribute',
        foreignKey: {
          name: 'ProductAttribute_productId_fkey',
          columns: ['productId'],
          references: { schema: 'public', table: 'Product', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ProductAttribute',
        foreignKey: {
          name: 'ProductAttribute_attributeValueId_fkey',
          columns: ['attributeValueId'],
          references: { schema: 'public', table: 'AttributeValue', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ProductCategoryLink',
        foreignKey: {
          name: 'ProductCategoryLink_productId_fkey',
          columns: ['productId'],
          references: { schema: 'public', table: 'Product', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ProductCategoryLink',
        foreignKey: {
          name: 'ProductCategoryLink_categoryId_fkey',
          columns: ['categoryId'],
          references: { schema: 'public', table: 'Category', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ProductMedia',
        foreignKey: {
          name: 'ProductMedia_productId_fkey',
          columns: ['productId'],
          references: { schema: 'public', table: 'Product', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ProductMedia',
        foreignKey: {
          name: 'ProductMedia_attributeValueId_fkey',
          columns: ['attributeValueId'],
          references: { schema: 'public', table: 'AttributeValue', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ProductVariant',
        foreignKey: {
          name: 'ProductVariant_productId_fkey',
          columns: ['productId'],
          references: { schema: 'public', table: 'Product', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'UserIdentity',
        foreignKey: {
          name: 'UserIdentity_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'UserSession',
        foreignKey: {
          name: 'UserSession_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'VariantAttribute',
        foreignKey: {
          name: 'VariantAttribute_variantId_fkey',
          columns: ['variantId'],
          references: { schema: 'public', table: 'ProductVariant', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'VariantAttribute',
        foreignKey: {
          name: 'VariantAttribute_attributeValueId_fkey',
          columns: ['attributeValueId'],
          references: { schema: 'public', table: 'AttributeValue', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
