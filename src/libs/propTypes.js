import PropTypes from 'prop-types';

export const creaturePropType =
    PropTypes.shape({
        form: PropTypes.shape({
            pattern: PropTypes.number,
            colors: PropTypes.number
        }),
        mouth: PropTypes.shape({
            pattern: PropTypes.number,
            colors: PropTypes.number
        }),
        eye: PropTypes.shape({
            pattern: PropTypes.number,
            colors: PropTypes.number
        })
    });