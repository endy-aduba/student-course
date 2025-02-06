import { Link } from 'react-router-dom';

function Navbar() {
	return (
		<nav className='navbar navbar-expand-lg navbar-light bg-light'>
			<div className='container-fluid'>
				<a className='navbar-brand' href='#'>
					STUDENT PORTAL
				</a>
				<button
					className='navbar-toggler'
					type='button'
					data-bs-toggle='collapse'
					data-bs-target='#navbarNav'
					aria-controls='navbarNav'
					aria-expanded='false'
					aria-label='Toggle navigation'
				>
					<span className='navbar-toggler-icon'></span>
				</button>
				<div className='collapse navbar-collapse' id='navbarNav'>
					<ul className='navbar-nav'>
						<li className='nav-item'>
							<Link to='/' className='nav-link active' aria-current='page'>
								Home
							</Link>
						</li>
						<li className='nav-item'>
							<Link to='/Login' className='nav-link'>
								Login
							</Link>
						</li>
						<li className='nav-item'>
							<Link to='/Student' className='nav-link'>
								Student
							</Link>
						</li>
						<li className='nav-item'>
							<Link to='/Course' className='nav-link'>
								Courses
							</Link>
						</li>
						<li className='nav-item'>
							<Link to='/Admin' className='nav-link'>
								Admin
							</Link>
						</li>
						<li className='nav-item'>
							<Link to='/Sign-Up' className='nav-link'>
								Sign-Up
							</Link>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
}

export default Navbar;
