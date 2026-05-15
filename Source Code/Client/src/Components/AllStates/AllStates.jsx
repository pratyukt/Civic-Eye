import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { notifyError } from '../../utils/tostify'
import { useNavigate } from 'react-router-dom'
import LocationCard from '../../utils/LocationCard'
import { routes } from '../../data/routes'
import { Loader2, Building2 } from 'lucide-react'
const AllStates = () => {
    const [states, setStates] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const getAllStates = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BASEURL}/department/get-all-state-of-department`)
            if (res.data.status == "OK") {
                setStates(res.data.data)
            } else {
                notifyError(res.data.msg)
            }
        } catch (err) {
            const msg = `err on AllState on calling axios ${err.message}`
            notifyError(msg);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAllStates();
    }, [])

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
    )

    if (states.length == 0) return (
        <div className="flex flex-col items-center justify-center py-20">
            <Building2 className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Departments Found</h3>
            <p className="text-gray-400 text-center max-w-md">No departments have been registered yet. Departments will appear here once they sign up and get verified by the admin.</p>
        </div>
    )

    return (
        <div className='p-16 flex gap-15 flex-wrap shrink-1 '>{
            states?.map((ele, ind) => {
                return (
                    <LocationCard
                        key={ind}
                        className='cursor-pointer border rounded-xl px-3 py-2 bg-amber-300'
                        onClick={() => {
                            navigate(`${routes.departmentInfo}/${ele}`)
                        }}
                        locName={ele}
                        locType={"States"}
                    ></LocationCard>)
            })
        }</div>
    )
}

export default AllStates

