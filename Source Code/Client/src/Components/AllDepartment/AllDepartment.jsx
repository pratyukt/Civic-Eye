import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { notifyError } from '../../utils/tostify'
import { useParams, useNavigate } from 'react-router-dom'
import LocationCard from '../../utils/LocationCard'
import { routes } from '../../data/routes';
import {
    Loader2, Building
} from 'lucide-react'
const AllDepartment = () => {
    const [department, setDepartment] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const { param, district } = useParams()

    const getAllDepartment = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BASEURL}/department/get-all-department-of-district?state=${param}&district=${district}`)
            if (res.data.status == "OK") {
                if (res.data.data.length == 0) {
                    navigate(routes.departmentInfo)
                }
                setDepartment(res.data.data)
            } else {
                notifyError(res.data.msg)
            }
        } catch (err) {
            const msg = `err on getAllDepartment on calling axios ${err.message}`
            notifyError(msg);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAllDepartment();
    }, [])

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
    )

    if (department.length == 0) return (
        <div className="flex flex-col items-center justify-center py-20">
            <Building className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Departments Found</h3>
            <p className="text-gray-400">No verified departments found in {district}, {param}</p>
        </div>
    )

    return (
        <div className='p-16 flex gap-15 flex-wrap shrink-1 '>{
            department?.map((ele, ind) => {
                return (
                    <LocationCard
                        key={ind}
                        className='cursor-pointer border rounded-xl px-3 py-2 bg-amber-300'
                        onClick={() => {
                            navigate(`${routes.departmentInfo}/${param}/${district}/${ele}`)
                        }}
                        locName={ele}
                        locType={"Departments"}
                    ></LocationCard>)
            })
        }</div>
    )
}

export default AllDepartment
