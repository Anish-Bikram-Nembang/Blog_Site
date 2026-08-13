import { PoolClient } from "pg";
import { UserEntity } from "../types/user.entity.js";

export default async function seedUsers({ pg }: { pg: PoolClient }): Promise<UserEntity[]> {
}

