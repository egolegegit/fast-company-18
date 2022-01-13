import React from "../../hooks/useProfession";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import {
    getProfessionByIDs,
    getProfessionsLoadingStatus
} from "../../store/professions";

const Profession = ({ id }) => {
    const prof = useSelector(getProfessionByIDs(id));
    const isLoading = useSelector(getProfessionsLoadingStatus());

    if (isLoading) {
        return <p>{prof.name}</p>;
    } else return "loading ...";
};
Profession.propTypes = {
    id: PropTypes.string
};
export default Profession;
