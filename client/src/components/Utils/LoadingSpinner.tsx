import React from "react";

import styles from "../../styles/Utils/LoadingSpinner.module.scss";

interface IProps {
	size: string;
}

const LoadingSpinner: React.FC<IProps> = ({ size }) => {
	return (
		<svg className={styles.spinner} width={size} height={size} viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
			<circle className={styles.path} fill="none" strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r="30"></circle>
		</svg>
	);
};

export default LoadingSpinner;
