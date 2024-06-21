// import "core-js/stable/atob";
import { useSelector } from "react-redux";
import { selectCurrentToken, selectPushToken } from "../redux/auth/authSlice";
import { jwtDecode } from "jwt-decode";

export const useAuth = () => {
    const token = useSelector(selectCurrentToken);
    const expoPushToken = useSelector(selectPushToken);

    let isAdmin = false;
    let isCreator = false;
    let isCs = false;
    let isApplicant = false;
    let status = "";
    try {
        if (token) {
            const decoded = jwtDecode(token);
            const { user } = decoded;

            const { _id: id, role } = user;

            isAdmin = role === "admin";
            isCreator = role === "creator";
            isCs = role === "cs";
            isApplicant = role === "applicant";

            if (isAdmin) status = "Admin";
            if (isCreator) status = "creator";
            if (isCs) status = "customer service";
            if (isApplicant) status = "applicant";

            if (id) {
                return {
                    id,
                    role,
                    isAdmin,
                    isCreator,
                    isCs,
                    isApplicant,
                    user,
                    status,
                    expoPushToken
                };
            }
        }
    } catch (error) {
        console.log("erroruseauth", error);
    }
    return {
        id: null,
        role: [],
        isAdmin: false,
        isCreator: false,
        isCs: false,
        isApplicant: false,
        user: {},
        status: "",
        expoPushToken
    };
};
