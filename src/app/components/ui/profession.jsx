import React from "../../hooks/useProfession";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import {
    getProfessionByIDs,
    getProfessionsLoadingStatus
} from "../../store/professions";

const Profession = ({ id }) => {
    const professionsLoading = useSelector(getProfessionsLoadingStatus());

    const prof = getProfessionByIDs(id);
    if (!professionsLoading) {
        return <p>{prof.name}</p>;
    } else return "loading ...";
};
Profession.propTypes = {
    id: PropTypes.string
};
export default Profession;
