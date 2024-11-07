
CREATE TABLE b_rpa_type (
  ID int8 GENERATED BY DEFAULT AS IDENTITY NOT NULL,
  NAME varchar(255) NOT NULL,
  TITLE varchar(255) NOT NULL,
  TABLE_NAME varchar(64) NOT NULL,
  IMAGE varchar(255),
  CREATED_BY int8 NOT NULL,
  SETTINGS text,
  PRIMARY KEY (ID)
);
CREATE UNIQUE INDEX ux_b_rpa_type_table_name ON b_rpa_type (table_name);

CREATE TABLE b_rpa_stage (
  ID int8 GENERATED BY DEFAULT AS IDENTITY NOT NULL,
  NAME varchar(255) NOT NULL,
  CODE varchar(50),
  COLOR char(6),
  SORT int NOT NULL DEFAULT 500,
  SEMANTIC varchar(50),
  TYPE_ID int NOT NULL,
  PRIMARY KEY (ID)
);
CREATE INDEX ix_b_rpa_stage_type_id ON b_rpa_stage (type_id);

CREATE TABLE b_rpa_field (
  ID int8 GENERATED BY DEFAULT AS IDENTITY NOT NULL,
  TYPE_ID int NOT NULL,
  STAGE_ID int NOT NULL,
  FIELD varchar(255) NOT NULL,
  VISIBILITY varchar(255) NOT NULL,
  PRIMARY KEY (ID)
);
CREATE INDEX ix_b_rpa_field_type_id_stage_id ON b_rpa_field (type_id, stage_id);

CREATE TABLE b_rpa_permission (
  ID int8 GENERATED BY DEFAULT AS IDENTITY NOT NULL,
  ENTITY varchar(50) NOT NULL,
  ENTITY_ID int NOT NULL,
  ACCESS_CODE varchar(100) NOT NULL,
  ACTION varchar(50) NOT NULL,
  PERMISSION char(1) NOT NULL,
  PRIMARY KEY (ID)
);
CREATE INDEX ix_b_rpa_permission_entity_entity_id ON b_rpa_permission (entity, entity_id);

CREATE TABLE b_rpa_stage_to_stage (
  ID int8 GENERATED BY DEFAULT AS IDENTITY NOT NULL,
  STAGE_ID int NOT NULL,
  STAGE_TO_ID int NOT NULL,
  PRIMARY KEY (ID)
);
CREATE INDEX ix_b_rpa_stage_to_stage_stage_id ON b_rpa_stage_to_stage (stage_id);

CREATE TABLE b_rpa_item_history (
  ID int8 GENERATED BY DEFAULT AS IDENTITY NOT NULL,
  ITEM_ID int NOT NULL,
  TYPE_ID int NOT NULL,
  CREATED_TIME timestamp NOT NULL,
  STAGE_ID int NOT NULL,
  NEW_STAGE_ID int,
  USER_ID int NOT NULL,
  ACTION varchar(255),
  SCOPE varchar(255) NOT NULL DEFAULT 'manual',
  TASK_ID int,
  PRIMARY KEY (ID)
);
CREATE INDEX ix_b_rpa_item_history_type_id_item_id ON b_rpa_item_history (type_id, item_id);

CREATE TABLE b_rpa_item_history_fields (
  ID int8 GENERATED BY DEFAULT AS IDENTITY NOT NULL,
  ITEM_HISTORY_ID int NOT NULL,
  FIELD_NAME varchar(255) NOT NULL,
  PRIMARY KEY (ID)
);
CREATE INDEX ix_b_rpa_item_history_fields_item_history_id ON b_rpa_item_history_fields (item_history_id);

CREATE TABLE b_rpa_item_sort (
  ID int8 GENERATED BY DEFAULT AS IDENTITY NOT NULL,
  USER_ID int8 NOT NULL,
  TYPE_ID int8 NOT NULL,
  ITEM_ID int8 NOT NULL,
  SORT int NOT NULL,
  PRIMARY KEY (ID)
);
CREATE INDEX ix_b_rpa_item_sort_user_id_type_id_item_id ON b_rpa_item_sort (user_id, type_id, item_id);

CREATE TABLE b_rpa_timeline (
  ID int8 GENERATED BY DEFAULT AS IDENTITY NOT NULL,
  TYPE_ID int8 NOT NULL,
  ITEM_ID int8 NOT NULL,
  CREATED_TIME timestamp NOT NULL,
  USER_ID int8,
  TITLE varchar(255),
  DESCRIPTION text,
  ACTION varchar(255),
  IS_FIXED char(1) NOT NULL DEFAULT 'N',
  DATA text,
  PRIMARY KEY (ID)
);
CREATE INDEX ix_b_rpa_timeline_type_id_item_id ON b_rpa_timeline (type_id, item_id);