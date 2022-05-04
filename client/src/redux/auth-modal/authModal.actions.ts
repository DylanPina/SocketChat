import { Dispatch } from "redux";
import { AuthModalType } from "./authModal.types";

export type AuthModalAction = {
	type: string;
	payload?: string;
};

export const displayLoginModal = () => {
	return (dispatch: Dispatch<AuthModalAction>) => {
		dispatch({
			type: AuthModalType.LOGIN_MODAL,
		});
	};
};

export const displaySignupModal = () => {
	return (dispatch: Dispatch<AuthModalAction>) => {
		dispatch({
			type: AuthModalType.SIGNUP_MODAL,
		});
	};
};
