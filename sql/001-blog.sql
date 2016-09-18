create table if not exists
posts (
  id         bigserial primary key,
  title      text not null,
  body       text not null,
  author     text not null references basic_auth.users (email)
               on delete restrict on update cascade
               default basic_auth.current_email(),
  created_at timestamptz not null default current_date
);

create table if not exists
comments (
  id         bigserial primary key,
  body       text not null,
  author     text not null references basic_auth.users (email)
               on delete restrict on update cascade
               default basic_auth.current_email(),
  post       bigint not null references posts (id)
               on delete cascade on update cascade,
  created_at timestamptz not null default current_date
);


create role author;
grant author to authenticator;

grant usage on schema public, basic_auth to author;

-- authors can edit comments/posts
grant select, insert, update, delete
  on table users, posts, comments to author;
grant usage, select on sequence posts_id_seq, comments_id_seq to author;

grant select on posts, comments to anon;

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

drop policy if exists posts_select_unsecure on posts;
create policy posts_select_unsecure on posts for select
  using (true);

drop policy if exists comments_select_unsecure on comments;
create policy comments_select_unsecure on comments for select
  using (true);

drop policy if exists authors_eigencreate on posts;
create policy authors_eigencreate on posts for insert
  with check (
    author = basic_auth.current_email()
  );

drop policy if exists authors_eigencreate on comments;
create policy authors_eigencreate on comments for insert
  with check (
      author = basic_auth.current_email()
  );

drop policy if exists authors_eigenedit on posts;
create policy authors_eigenedit on posts for update
  using (author = basic_auth.current_email())
  with check (
    author = basic_auth.current_email()
  );

drop policy if exists authors_eigenedit on comments;
create policy authors_eigenedit on comments for update
  using (author = basic_auth.current_email())
  with check (
    author = basic_auth.current_email()
  );

drop policy if exists authors_eigendelete on posts;
create policy authors_eigendelete on posts for delete
  using (author = basic_auth.current_email());

drop policy if exists authors_eigendelete on comments;
create policy authors_eigendelete on comments for delete
  using (author = basic_auth.current_email());
