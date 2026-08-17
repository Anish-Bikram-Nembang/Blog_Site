import { PoolClient } from "pg";
import { UserEntity } from "../types/user.entity.js";
import { faker } from "@faker-js/faker";

export default async function seedUsers({ pg }: { pg: PoolClient }): Promise<UserEntity[]> {
  const username = faker.person.fullName
}

