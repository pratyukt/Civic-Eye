import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { notifyError } from '../../utils/tostify'
import { useNavigate } from 'react-router-dom'
import LocationCard from '../../utils/LocationCard'
import { Loader2 } from 'lucide-react'
const AllStates = () => {

    const getAllStates = async () => {
        await axios.get(`${import.meta.env.VITE_BASEURL}/department/get-all-state-of-department`).then((res) => {
            if (res.data.status == "OK") {
                setStates(res.data.data)
            } else {
                notifyError(res.data.msg)
            }
        }).catch((err) => {
            const msg = `err on AllState on calling axios ${err.message}`
            notifyError(msg);
        })
    }

    const [states, setStates] = useState([])
    const navigate = useNavigate()
    useEffect(() => {
        getAllStates();
    }, [])
    if (states.length == 0) return <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          </div>
    return (
        <div className='p-16 flex gap-15 flex-wrap shrink-1 '>{
            states?.map((ele, ind) => {
                return (
                    <LocationCard
                        key={ind}
                        className='cursor-pointer border rounded-xl px-3 py-2 bg-amber-300'
                        onClick={() => {
                            navigate(`${ele}`)
                        }}
                        locName={ele}
                        locType={"States"}
                    ></LocationCard>)
            })
        }</div>
    )
}

export default AllStates
