import React from 'react';
import { Link } from "react-router-dom";


function Logo(props) {
	return (
		<div className="site-logo">
			<Link to="/"><h2>ISO95.</h2></Link>
		</div>
		)
}

export default Logo