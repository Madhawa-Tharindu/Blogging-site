import { useContext } from "react";
import AnimationWrapper from "../common/page-animation";
import { Link } from "react-router-dom";
import { UserContext } from "../App";

const UserNavigationPanel = () => {

    const { userAuth: { username } } = useContext(UserContext);

    return (
        <div>
            <AnimationWrapper 
                transition={{ duration: 0.2, y: { duration: 0.1 } }}
            >
                <div className="bg-white absolute right-0 border border-grey w-60 overflow-hidden duration-200">

                    <Link to="/editor" className="flex gap-2 link md:hidden pl-8 py-4">
                        <i className="fi fi-rr-file-edit"></i>
                        <p>Write</p>
                    </Link>

                    <Link to={`/user/${username}`}>
                        Profile
                    </Link>

                </div>

            </AnimationWrapper>
        </div>
    )
}

export default UserNavigationPanel;