create table if not exists public.user_credits (
    user_id uuid references auth.users not null primary key,
    credits int not null default 3,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
