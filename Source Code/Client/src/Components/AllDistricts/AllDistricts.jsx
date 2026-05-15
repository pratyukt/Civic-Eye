import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import { routes } from '../../data/routes';
import { notifyError } from '../../utils/tostify';
import LocationCard from '../../utils/LocationCard';
import { Loader2, MapPin } from 'lucide-react'
const AllDistricts = () => {
    const { param } = useParams()
    const [districts, setDistricts] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const getAllDistricts = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BASEURL}/department/get-all-districts-of-state?state=${param}`)
            if (res.data.status == "OK") {
                if (res.data.data.length == 0) {
                    navigate(routes.departmentInfo)
                }
                setDistricts(res.data.data)
            } else {
                notifyError(res.data.msg)
            }
        } catch (err) {
            const msg = `err on AllDistricts on calling axios ${err.message}`
            notifyError(msg);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAllDistricts()
    }, [])

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
    )

    if (districts.length == 0) return (
        <div className="flex flex-col items-center justify-center py-20">
            <MapPin className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Districts Found</h3>
            <p className="text-gray-400">No districts found for {param}</p>
        </div>
    )

    return (
        <div className='p-16 flex gap-15 flex-wrap shrink-1 '>{
            districts?.map((ele, ind) => {
                return (
                    <div className='pb-14  ' key={ind}>
                        <LocationCard
                            onClick={(e) => {
                                navigate(`${routes.departmentInfo}/${param}/${ele}`)
                            }}
                            locName={ele}
                            locType={"Districts"}
                        />
                    </div>

                )
            })
        }</div>
    )
}

export default AllDistricts