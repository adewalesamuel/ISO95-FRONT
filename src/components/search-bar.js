import React from 'react';
import { withRouter } from 'react-router-dom';

import Input from './input';
import Form from './form';

import { parseQueryString, setTitle } from './../modules/common'
import { _ } from './../modules/translate'

import searchIcon from './../assets/icons/search.svg'

class SearchBar extends React.Component {
	constructor(props) {
		super(props)

		this.searchForm = React.createRef()
		this.search = this.search.bind(this)
		this.onInputChange = this.onInputChange.bind(this)

		this.state = {
			searchQuery: ''
		} 
	}

	onInputChange(e) {
	  const name = e.target.name
	  const value = e.target.value
	  this.setState({
	    [name]: value,
	  })
	}

	componentDidMount() {
		let search = window.location.search
		if (!search) return
		this.setState({searchQuery: parseQueryString(search).q})
	}

	search(e) {
		e.preventDefault()
		let q = this.state.searchQuery.trim()
		if (q === '' ) return
		setTitle("Search: " + q)
		this.props.history.push('/search?q=' + q);
	}

	render() {
		return (
			<div className='search-bar'>
				<Form ref={ this.searchForm }
							name="search"
							onSubmit={ this.search }>
					<Input name='searchQuery'
								type='search'
								placeholder={_("Rechercher")}
								required={false}
								value={this.state.searchQuery}
								onChange={this.onInputChange}/>		
					<img className="input-icon" 
					  alt=""
					  src={ searchIcon } 
					  width="20px" 
					  onClick={ this.changeHiddenState } /> 
				</Form>
			</div>
			)
	}
}

export default withRouter(SearchBar)