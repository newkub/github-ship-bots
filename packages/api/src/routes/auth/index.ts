import login from "./login";
import callback from "./callback";
import session from "./session";
import logout from "./logout";

const auth = login.use(callback).use(session).use(logout);

export default auth;
