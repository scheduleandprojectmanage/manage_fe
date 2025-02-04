import {useState} from "react";
import {createSearchParams, useNavigate, useSearchParams} from "react-router-dom";

const useCustomMove = () =>{
    const navigate = useNavigate()

    const moveToMain = () => {
        navigate({
            pathname: '../main'
        })
    }

    const moveToModify = () => {
        navigate({
            pathname: `../modify`
        })
    }
}

export default useCustomMove