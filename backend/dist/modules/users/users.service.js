import userRepository from "./users.repository.js";
const userService = {
    async findUserByUsername(username) {
        return userRepository.findUserByUsername(username);
    },
    async createUser(createUserPayload) {
        return userRepository.createUser(createUserPayload);
    }
};
export default userService;
