import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { addUserData } from '../../Store/userDataSlice'
import { useNavigate } from 'react-router-dom'
import { routes } from '../../data/routes'
import { toast } from 'react-toastify';
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { addDeptData } from '../../Store/departmentDataSlice'
function OAuth({ children }) {
    const notifyError = (err) => toast.error(err);
    const notifySuccess = (suc) => toast.success(suc);
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const authenticator = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate(routes.userLogin)
        } else {
            try {
                await axios.post(`${import.meta.env.VITE_BASEURL}/refresh`, {}, { headers: { token: token } })
                    .then((response) => {
                        if (response.data.status === "OK") {
                            if (response.data.data[0].role === "department") {
                                dispatch(addDeptData(response.data.data[0]))

                            } else if (response.data.data[0].role === "user") {

                                dispatch(addUserData(response.data.data[0]));
                                // notifySuccess(response.data.msg);
                            }
                        }
                        if (response.data.data.status === "ERR") {
                            localStorage.removeItem("token");
                            navigate(routes.userLogin);
                        }
                    }).catch((error) => {
                        notifyError(error.response.data.msg);
                        localStorage.removeItem("token");
                        navigate(routes.userLogin)
                        console.log(error);
                    })

                setIsLoading(false)

            } catch (error) {
                notifyError(error.message);
                console.log(error);
            }

        }
    }
    useEffect(() => {
        authenticator();
    }, [])
    return (
        <>
            {
                isLoading ? <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          </div> : children}

        </>

    )
}

export default OAuth