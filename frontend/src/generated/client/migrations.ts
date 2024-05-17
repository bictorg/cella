// @ts-nocheck
export default [
  {
    "statements": [
      "CREATE TABLE \"tasks\" (\n  \"id\" TEXT NOT NULL,\n  \"slug\" TEXT NOT NULL,\n  \"markdown\" TEXT,\n  \"summary\" TEXT NOT NULL,\n  \"type\" TEXT NOT NULL,\n  \"impact\" INTEGER,\n  \"sort_order\" INTEGER,\n  \"status\" INTEGER NOT NULL,\n  \"project_id\" TEXT NOT NULL,\n  \"created_at\" TEXT NOT NULL,\n  \"created_by\" TEXT NOT NULL,\n  \"assigned_by\" TEXT,\n  \"assigned_at\" TEXT,\n  \"modified_at\" TEXT,\n  \"modified_by\" TEXT,\n  CONSTRAINT \"tasks_pkey\" PRIMARY KEY (\"id\")\n) WITHOUT ROWID;\n",
      "CREATE TABLE \"labels\" (\n  \"id\" TEXT NOT NULL,\n  \"name\" TEXT NOT NULL,\n  \"color\" TEXT,\n  \"project_id\" TEXT NOT NULL,\n  CONSTRAINT \"labels_pkey\" PRIMARY KEY (\"id\")\n) WITHOUT ROWID;\n",
      "CREATE TABLE \"task_labels\" (\n  \"task_id\" TEXT NOT NULL,\n  \"label_id\" TEXT NOT NULL,\n  CONSTRAINT \"task_labels_label_id_labels_id_fk\" FOREIGN KEY (\"label_id\") REFERENCES \"labels\" (\"id\") ON DELETE CASCADE,\n  CONSTRAINT \"task_labels_task_id_labels_id_fk\" FOREIGN KEY (\"task_id\") REFERENCES \"tasks\" (\"id\") ON DELETE CASCADE,\n  CONSTRAINT \"task_labels_label_id_task_id_pk\" PRIMARY KEY (\"label_id\", \"task_id\")\n) WITHOUT ROWID;\n",
      "CREATE TABLE \"task_users\" (\n  \"task_id\" TEXT NOT NULL,\n  \"user_id\" TEXT NOT NULL,\n  \"role\" TEXT NOT NULL,\n  CONSTRAINT \"task_users_task_id_users_id_fk\" FOREIGN KEY (\"task_id\") REFERENCES \"tasks\" (\"id\") ON DELETE CASCADE,\n  CONSTRAINT \"task_users_user_id_task_id_pk\" PRIMARY KEY (\"user_id\", \"task_id\")\n) WITHOUT ROWID;\n",
      "INSERT OR IGNORE INTO _electric_trigger_settings(tablename,flag) VALUES ('main.tasks', 1);",
      "DROP TRIGGER IF EXISTS update_ensure_main_tasks_primarykey;",
      "CREATE TRIGGER update_ensure_main_tasks_primarykey\n  BEFORE UPDATE ON \"main\".\"tasks\"\nBEGIN\n  SELECT\n    CASE\n      WHEN old.\"id\" != new.\"id\" THEN\n      \t\tRAISE (ABORT, 'cannot change the value of column id as it belongs to the primary key')\n    END;\nEND;",
      "DROP TRIGGER IF EXISTS insert_main_tasks_into_oplog;",
      "CREATE TRIGGER insert_main_tasks_into_oplog\n   AFTER INSERT ON \"main\".\"tasks\"\n   WHEN 1 == (SELECT flag from _electric_trigger_settings WHERE tablename == 'main.tasks')\nBEGIN\n  INSERT INTO _electric_oplog (namespace, tablename, optype, primaryKey, newRow, oldRow, timestamp)\n  VALUES ('main', 'tasks', 'INSERT', json_object('id', new.\"id\"), json_object('assigned_at', new.\"assigned_at\", 'assigned_by', new.\"assigned_by\", 'created_at', new.\"created_at\", 'created_by', new.\"created_by\", 'id', new.\"id\", 'impact', new.\"impact\", 'markdown', new.\"markdown\", 'modified_at', new.\"modified_at\", 'modified_by', new.\"modified_by\", 'project_id', new.\"project_id\", 'slug', new.\"slug\", 'sort_order', new.\"sort_order\", 'status', new.\"status\", 'summary', new.\"summary\", 'type', new.\"type\"), NULL, NULL);\nEND;",
      "DROP TRIGGER IF EXISTS update_main_tasks_into_oplog;",
      "CREATE TRIGGER update_main_tasks_into_oplog\n   AFTER UPDATE ON \"main\".\"tasks\"\n   WHEN 1 == (SELECT flag from _electric_trigger_settings WHERE tablename == 'main.tasks')\nBEGIN\n  INSERT INTO _electric_oplog (namespace, tablename, optype, primaryKey, newRow, oldRow, timestamp)\n  VALUES ('main', 'tasks', 'UPDATE', json_object('id', new.\"id\"), json_object('assigned_at', new.\"assigned_at\", 'assigned_by', new.\"assigned_by\", 'created_at', new.\"created_at\", 'created_by', new.\"created_by\", 'id', new.\"id\", 'impact', new.\"impact\", 'markdown', new.\"markdown\", 'modified_at', new.\"modified_at\", 'modified_by', new.\"modified_by\", 'project_id', new.\"project_id\", 'slug', new.\"slug\", 'sort_order', new.\"sort_order\", 'status', new.\"status\", 'summary', new.\"summary\", 'type', new.\"type\"), json_object('assigned_at', old.\"assigned_at\", 'assigned_by', old.\"assigned_by\", 'created_at', old.\"created_at\", 'created_by', old.\"created_by\", 'id', old.\"id\", 'impact', old.\"impact\", 'markdown', old.\"markdown\", 'modified_at', old.\"modified_at\", 'modified_by', old.\"modified_by\", 'project_id', old.\"project_id\", 'slug', old.\"slug\", 'sort_order', old.\"sort_order\", 'status', old.\"status\", 'summary', old.\"summary\", 'type', old.\"type\"), NULL);\nEND;",
      "DROP TRIGGER IF EXISTS delete_main_tasks_into_oplog;",
      "CREATE TRIGGER delete_main_tasks_into_oplog\n   AFTER DELETE ON \"main\".\"tasks\"\n   WHEN 1 == (SELECT flag from _electric_trigger_settings WHERE tablename == 'main.tasks')\nBEGIN\n  INSERT INTO _electric_oplog (namespace, tablename, optype, primaryKey, newRow, oldRow, timestamp)\n  VALUES ('main', 'tasks', 'DELETE', json_object('id', old.\"id\"), NULL, json_object('assigned_at', old.\"assigned_at\", 'assigned_by', old.\"assigned_by\", 'created_at', old.\"created_at\", 'created_by', old.\"created_by\", 'id', old.\"id\", 'impact', old.\"impact\", 'markdown', old.\"markdown\", 'modified_at', old.\"modified_at\", 'modified_by', old.\"modified_by\", 'project_id', old.\"project_id\", 'slug', old.\"slug\", 'sort_order', old.\"sort_order\", 'status', old.\"status\", 'summary', old.\"summary\", 'type', old.\"type\"), NULL);\nEND;",
      "INSERT OR IGNORE INTO _electric_trigger_settings(tablename,flag) VALUES ('main.labels', 1);",
      "DROP TRIGGER IF EXISTS update_ensure_main_labels_primarykey;",
      "CREATE TRIGGER update_ensure_main_labels_primarykey\n  BEFORE UPDATE ON \"main\".\"labels\"\nBEGIN\n  SELECT\n    CASE\n      WHEN old.\"id\" != new.\"id\" THEN\n      \t\tRAISE (ABORT, 'cannot change the value of column id as it belongs to the primary key')\n    END;\nEND;",
      "DROP TRIGGER IF EXISTS insert_main_labels_into_oplog;",
      "CREATE TRIGGER insert_main_labels_into_oplog\n   AFTER INSERT ON \"main\".\"labels\"\n   WHEN 1 == (SELECT flag from _electric_trigger_settings WHERE tablename == 'main.labels')\nBEGIN\n  INSERT INTO _electric_oplog (namespace, tablename, optype, primaryKey, newRow, oldRow, timestamp)\n  VALUES ('main', 'labels', 'INSERT', json_object('id', new.\"id\"), json_object('color', new.\"color\", 'id', new.\"id\", 'name', new.\"name\", 'project_id', new.\"project_id\"), NULL, NULL);\nEND;",
      "DROP TRIGGER IF EXISTS update_main_labels_into_oplog;",
      "CREATE TRIGGER update_main_labels_into_oplog\n   AFTER UPDATE ON \"main\".\"labels\"\n   WHEN 1 == (SELECT flag from _electric_trigger_settings WHERE tablename == 'main.labels')\nBEGIN\n  INSERT INTO _electric_oplog (namespace, tablename, optype, primaryKey, newRow, oldRow, timestamp)\n  VALUES ('main', 'labels', 'UPDATE', json_object('id', new.\"id\"), json_object('color', new.\"color\", 'id', new.\"id\", 'name', new.\"name\", 'project_id', new.\"project_id\"), json_object('color', old.\"color\", 'id', old.\"id\", 'name', old.\"name\", 'project_id', old.\"project_id\"), NULL);\nEND;",
      "DROP TRIGGER IF EXISTS delete_main_labels_into_oplog;",
      "CREATE TRIGGER delete_main_labels_into_oplog\n   AFTER DELETE ON \"main\".\"labels\"\n   WHEN 1 == (SELECT flag from _electric_trigger_settings WHERE tablename == 'main.labels')\nBEGIN\n  INSERT INTO _electric_oplog (namespace, tablename, optype, primaryKey, newRow, oldRow, timestamp)\n  VALUES ('main', 'labels', 'DELETE', json_object('id', old.\"id\"), NULL, json_object('color', old.\"color\", 'id', old.\"id\", 'name', old.\"name\", 'project_id', old.\"project_id\"), NULL);\nEND;",
      "INSERT OR IGNORE INTO _electric_trigger_settings(tablename,flag) VALUES ('main.task_labels', 1);",
      "DROP TRIGGER IF EXISTS update_ensure_main_task_labels_primarykey;",
      "CREATE TRIGGER update_ensure_main_task_labels_primarykey\n  BEFORE UPDATE ON \"main\".\"task_labels\"\nBEGIN\n  SELECT\n    CASE\n      WHEN old.\"label_id\" != new.\"label_id\" THEN\n      \t\tRAISE (ABORT, 'cannot change the value of column label_id as it belongs to the primary key')\n      WHEN old.\"task_id\" != new.\"task_id\" THEN\n      \t\tRAISE (ABORT, 'cannot change the value of column task_id as it belongs to the primary key')\n    END;\nEND;",
      "DROP TRIGGER IF EXISTS insert_main_task_labels_into_oplog;",
      "CREATE TRIGGER insert_main_task_labels_into_oplog\n   AFTER INSERT ON \"main\".\"task_labels\"\n   WHEN 1 == (SELECT flag from _electric_trigger_settings WHERE tablename == 'main.task_labels')\nBEGIN\n  INSERT INTO _electric_oplog (namespace, tablename, optype, primaryKey, newRow, oldRow, timestamp)\n  VALUES ('main', 'task_labels', 'INSERT', json_object('label_id', new.\"label_id\", 'task_id', new.\"task_id\"), json_object('label_id', new.\"label_id\", 'task_id', new.\"task_id\"), NULL, NULL);\nEND;",
      "DROP TRIGGER IF EXISTS update_main_task_labels_into_oplog;",
      "CREATE TRIGGER update_main_task_labels_into_oplog\n   AFTER UPDATE ON \"main\".\"task_labels\"\n   WHEN 1 == (SELECT flag from _electric_trigger_settings WHERE tablename == 'main.task_labels')\nBEGIN\n  INSERT INTO _electric_oplog (namespace, tablename, optype, primaryKey, newRow, oldRow, timestamp)\n  VALUES ('main', 'task_labels', 'UPDATE', json_object('label_id', new.\"label_id\", 'task_id', new.\"task_id\"), json_object('label_id', new.\"label_id\", 'task_id', new.\"task_id\"), json_object('label_id', old.\"label_id\", 'task_id', old.\"task_id\"), NULL);\nEND;",
      "DROP TRIGGER IF EXISTS delete_main_task_labels_into_oplog;",
      "CREATE TRIGGER delete_main_task_labels_into_oplog\n   AFTER DELETE ON \"main\".\"task_labels\"\n   WHEN 1 == (SELECT flag from _electric_trigger_settings WHERE tablename == 'main.task_labels')\nBEGIN\n  INSERT INTO _electric_oplog (namespace, tablename, optype, primaryKey, newRow, oldRow, timestamp)\n  VALUES ('main', 'task_labels', 'DELETE', json_object('label_id', old.\"label_id\", 'task_id', old.\"task_id\"), NULL, json_object('label_id', old.\"label_id\", 'task_id', old.\"task_id\"), NULL);\nEND;",
      "DROP TRIGGER IF EXISTS compensation_insert_main_task_labels_label_id_into_oplog;",
      "CREATE TRIGGER compensation_insert_main_task_labels_label_id_into_oplog\n  AFTER INSERT ON \"main\".\"task_labels\"\n  WHEN 1 == (SELECT flag from _electric_trigger_settings WHERE tablename == 'main.labels') AND\n       1 == (SELECT value from _electric_meta WHERE key == 'compensations')\nBEGIN\n  INSERT INTO _electric_oplog (namespace, tablename, optype, primaryKey, newRow, oldRow, timestamp)\n  SELECT 'main', 'labels', 'COMPENSATION', json_object('id', \"id\"), json_object('id', \"id\"), NULL, NULL\n  FROM \"main\".\"labels\" WHERE \"id\" = new.\"label_id\";\nEND;",
      "DROP TRIGGER IF EXISTS compensation_update_main_task_labels_label_id_into_oplog;",
      "CREATE TRIGGER compensation_update_main_task_labels_label_id_into_oplog\n   AFTER UPDATE ON \"main\".\"task_labels\"\n   WHEN 1 == (SELECT flag from _electric_trigger_settings WHERE tablename == 'main.labels') AND\n        1 == (SELECT value from _electric_meta WHERE key == 'compensations')\nBEGIN\n  INSERT INTO _electric_oplog (namespace, tablename, optype, primaryKey, newRow, oldRow, timestamp)\n  SELECT 'main', 'labels', 'COMPENSATION', json_object('id', \"id\"), json_object('id', \"id\"), NULL, NULL\n  FROM \"main\".\"labels\" WHERE \"id\" = new.\"label_id\";\nEND;",
      "DROP TRIGGER IF EXISTS compensation_insert_main_task_labels_task_id_into_oplog;",
      "CREATE TRIGGER compensation_insert_main_task_labels_task_id_into_oplog\n  AFTER INSERT ON \"main\".\"task_labels\"\n  WHEN 1 == (SELECT flag from _electric_trigger_settings WHERE tablename == 'main.tasks') AND\n       1 == (SELECT value from _electric_meta WHERE key == 'compensations')\nBEGIN\n  INSERT INTO _electric_oplog (namespace, tablename, optype, primaryKey, newRow, oldRow, timestamp)\n  SELECT 'main', 'tasks', 'COMPENSATION', json_object('id', \"id\"), json_object('id', \"id\"), NULL, NULL\n  FROM \"main\".\"tasks\" WHERE \"id\" = new.\"task_id\";\nEND;",
      "DROP TRIGGER IF EXISTS compensation_update_main_task_labels_task_id_into_oplog;",
      "CREATE TRIGGER compensation_update_main_task_labels_task_id_into_oplog\n   AFTER UPDATE ON \"main\".\"task_labels\"\n   WHEN 1 == (SELECT flag from _electric_trigger_settings WHERE tablename == 'main.tasks') AND\n        1 == (SELECT value from _electric_meta WHERE key == 'compensations')\nBEGIN\n  INSERT INTO _electric_oplog (namespace, tablename, optype, primaryKey, newRow, oldRow, timestamp)\n  SELECT 'main', 'tasks', 'COMPENSATION', json_object('id', \"id\"), json_object('id', \"id\"), NULL, NULL\n  FROM \"main\".\"tasks\" WHERE \"id\" = new.\"task_id\";\nEND;",
      "INSERT OR IGNORE INTO _electric_trigger_settings(tablename,flag) VALUES ('main.task_users', 1);",
      "DROP TRIGGER IF EXISTS update_ensure_main_task_users_primarykey;",
      "CREATE TRIGGER update_ensure_main_task_users_primarykey\n  BEFORE UPDATE ON \"main\".\"task_users\"\nBEGIN\n  SELECT\n    CASE\n      WHEN old.\"task_id\" != new.\"task_id\" THEN\n      \t\tRAISE (ABORT, 'cannot change the value of column task_id as it belongs to the primary key')\n      WHEN old.\"user_id\" != new.\"user_id\" THEN\n      \t\tRAISE (ABORT, 'cannot change the value of column user_id as it belongs to the primary key')\n    END;\nEND;",
      "DROP TRIGGER IF EXISTS insert_main_task_users_into_oplog;",
      "CREATE TRIGGER insert_main_task_users_into_oplog\n   AFTER INSERT ON \"main\".\"task_users\"\n   WHEN 1 == (SELECT flag from _electric_trigger_settings WHERE tablename == 'main.task_users')\nBEGIN\n  INSERT INTO _electric_oplog (namespace, tablename, optype, primaryKey, newRow, oldRow, timestamp)\n  VALUES ('main', 'task_users', 'INSERT', json_object('task_id', new.\"task_id\", 'user_id', new.\"user_id\"), json_object('role', new.\"role\", 'task_id', new.\"task_id\", 'user_id', new.\"user_id\"), NULL, NULL);\nEND;",
      "DROP TRIGGER IF EXISTS update_main_task_users_into_oplog;",
      "CREATE TRIGGER update_main_task_users_into_oplog\n   AFTER UPDATE ON \"main\".\"task_users\"\n   WHEN 1 == (SELECT flag from _electric_trigger_settings WHERE tablename == 'main.task_users')\nBEGIN\n  INSERT INTO _electric_oplog (namespace, tablename, optype, primaryKey, newRow, oldRow, timestamp)\n  VALUES ('main', 'task_users', 'UPDATE', json_object('task_id', new.\"task_id\", 'user_id', new.\"user_id\"), json_object('role', new.\"role\", 'task_id', new.\"task_id\", 'user_id', new.\"user_id\"), json_object('role', old.\"role\", 'task_id', old.\"task_id\", 'user_id', old.\"user_id\"), NULL);\nEND;",
      "DROP TRIGGER IF EXISTS delete_main_task_users_into_oplog;",
      "CREATE TRIGGER delete_main_task_users_into_oplog\n   AFTER DELETE ON \"main\".\"task_users\"\n   WHEN 1 == (SELECT flag from _electric_trigger_settings WHERE tablename == 'main.task_users')\nBEGIN\n  INSERT INTO _electric_oplog (namespace, tablename, optype, primaryKey, newRow, oldRow, timestamp)\n  VALUES ('main', 'task_users', 'DELETE', json_object('task_id', old.\"task_id\", 'user_id', old.\"user_id\"), NULL, json_object('role', old.\"role\", 'task_id', old.\"task_id\", 'user_id', old.\"user_id\"), NULL);\nEND;",
      "DROP TRIGGER IF EXISTS compensation_insert_main_task_users_task_id_into_oplog;",
      "CREATE TRIGGER compensation_insert_main_task_users_task_id_into_oplog\n  AFTER INSERT ON \"main\".\"task_users\"\n  WHEN 1 == (SELECT flag from _electric_trigger_settings WHERE tablename == 'main.tasks') AND\n       1 == (SELECT value from _electric_meta WHERE key == 'compensations')\nBEGIN\n  INSERT INTO _electric_oplog (namespace, tablename, optype, primaryKey, newRow, oldRow, timestamp)\n  SELECT 'main', 'tasks', 'COMPENSATION', json_object('id', \"id\"), json_object('id', \"id\"), NULL, NULL\n  FROM \"main\".\"tasks\" WHERE \"id\" = new.\"task_id\";\nEND;",
      "DROP TRIGGER IF EXISTS compensation_update_main_task_users_task_id_into_oplog;",
      "CREATE TRIGGER compensation_update_main_task_users_task_id_into_oplog\n   AFTER UPDATE ON \"main\".\"task_users\"\n   WHEN 1 == (SELECT flag from _electric_trigger_settings WHERE tablename == 'main.tasks') AND\n        1 == (SELECT value from _electric_meta WHERE key == 'compensations')\nBEGIN\n  INSERT INTO _electric_oplog (namespace, tablename, optype, primaryKey, newRow, oldRow, timestamp)\n  SELECT 'main', 'tasks', 'COMPENSATION', json_object('id', \"id\"), json_object('id', \"id\"), NULL, NULL\n  FROM \"main\".\"tasks\" WHERE \"id\" = new.\"task_id\";\nEND;"
    ],
    "version": "20240516102556_367"
  }
]