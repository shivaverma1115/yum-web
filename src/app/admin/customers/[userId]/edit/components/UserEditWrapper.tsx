import UserDetailsForm from '@/components/admin/customer/UserDetailsForm'
import { UserRole, type IUser } from '@/types/user';
import React from 'react'
/** Replace with API data when wired up */
const demoUser: IUser = {
    id: "1",
    first_name: "Kaiya",
    last_name: "Botosh",
    user_name: "kaiyabotosh",
    full_name: "Kaiya Botosh",
    email: "user@email.domain",
    role: UserRole.USER,
    phone: "(123) 123 1234",
    country: "United States",
    state: "Alabama",
    zip_code: "35010",
    description:
        "Hi I'm Kaiya Botosh, has been the industry's standard dummy text ever since the 1500s.",
    created_at: "2021-01-01",
    updated_at: "2021-01-01",
};

export default function UserEditWrapper() {
    return (
        <UserDetailsForm user={demoUser} />
    )
}

