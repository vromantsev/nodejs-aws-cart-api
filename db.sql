/* Create status enum */
create type cart_status as enum ('OPEN', 'ORDERED');

/* Create carts table */
create table if not exists carts (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null,
    created_at date not null default now(),
    updated_at date not null,
    status cart_status not null default 'OPEN'
);

/* Create cart_items table */
create table if not exists cart_items (
    cart_id uuid not null,
    product_id uuid,
    count int,
    constraint cart_id_fk foreign key (cart_id) references carts(id)
);

/* Insert some carts */
insert into carts (user_id, updated_at) values (gen_random_uuid(), now());

/* Insert some cart items */
insert into cart_items (cart_id, product_id, count) values ('43b3ebb8-b57b-4a69-996d-7a7c5b81aa04', gen_random_uuid(), 3);
insert into cart_items (cart_id, product_id, count) values ('f9ca97bc-b968-49f1-a57c-f75490718b9f', gen_random_uuid(), 2);
insert into cart_items (cart_id, product_id, count) values ('e2c03de9-e278-4cfd-9269-8945f8d613d3', gen_random_uuid(), 4);
