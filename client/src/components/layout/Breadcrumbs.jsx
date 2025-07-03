import { Breadcrumbs as MuiBreadcrumbs, Link, Typography } from '@mui/material';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { Home } from '@mui/icons-material';

const Breadcrumbs = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    const breadcrumbNameMap = {
        '/dashboard': 'Dashboard',
        '/catalogue': 'Colleague Catalogue'
    };

    return (
        <MuiBreadcrumbs aria-label="breadcrumb">
            <Link
                component={RouterLink}
                underline="hover"
                color="inherit"
                to="/"
                sx={{ display: 'flex', alignItems: 'center' }}
            >
                <Home sx={{ mr: 0.5 }} fontSize="inherit" />
                Home
            </Link>
            {pathnames.map((value, index) => {
                const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                const last = index === pathnames.length - 1;
                const routeName = breadcrumbNameMap[to] || value;
                return last ? (
                    <Typography color="text.primary" key={to}>
                        {routeName}
                    </Typography>
                ) : (
                    <Link
                        component={RouterLink}
                        underline="hover"
                        color="inherit"
                        to={to}
                        key={to}
                    >
                        {routeName}
                    </Link>
                );
            })}
        </MuiBreadcrumbs>
    );
};

export default Breadcrumbs;