import authService from "./auth.service.js";
const authController = {
    async signup(req, res) {
        const result = await authService.signup(req.body);
        res.status(201).json(result);
    },
    async login(req, res) {
        const result = await authService.login(req.body);
        res.json(result);
    }
};
export default authController;
