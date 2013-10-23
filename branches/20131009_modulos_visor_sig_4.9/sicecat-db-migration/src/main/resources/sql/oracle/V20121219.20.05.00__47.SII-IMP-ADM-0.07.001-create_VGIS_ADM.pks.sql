create or replace PROCEDURE check_users_folders_procedure 
AS
 id_user NUMBER;
 id_folder NUMBER;
 id_parent_folder NUMBER;
 cursor user_cursor is SELECT gis_user.id from gis_user 
    where not exists (select * from gis_folder where folder_user_id = gis_user.id and gis_folder.name like 'User''s layers');
BEGIN
  open user_cursor;
  loop
      fetch user_cursor into id_user;
      exit when user_cursor%NOTFOUND;
      dbms_output.put_line ('Updating user'||id_user);
      select gis_folder_seq.nextVal into id_folder from dual;
      select gis_folder.id into id_parent_folder 
        from gis_folder 
      where folder_user_id = id_user 
        and name is null;
      insert into gis_folder (id, folder_user_id, gis_folder.name, folder_parent_id) values (id_folder, id_user, 'User''s layers', id_parent_folder);
  end loop;
  close user_cursor;
END;
/
create or replace PROCEDURE check_users_layers_procedure 
AS
 id_layer NUMBER;
 id_folder NUMBER;
 id_user NUMBER;
 id_parent_folder NUMBER;
 cursor layer_cursor is SELECT gis_layer.id, gis_layer.layer_user_id from gis_layer 
    join gis_folder on gis_layer.layer_folder_id = gis_folder.id 
    where gis_folder.name is null
    and gis_layer.layer_user_id is not null;
BEGIN
  open layer_cursor;
  loop
      fetch layer_cursor into id_layer, id_user;
      exit when layer_cursor%NOTFOUND;
      select gis_folder.id into id_folder 
        from gis_folder 
          where gis_folder.folder_user_id = id_user 
            and name = 'User''s layers' ;
      dbms_output.put_line ('Set layer '||id_layer||' folder to '||id_folder);
      update gis_layer set layer_folder_id = id_folder where id = id_layer;
  end loop;
  close layer_cursor;
END;
/