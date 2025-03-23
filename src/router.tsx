import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { RouteObject } from 'react-router';

import SidebarLayout from 'src/layouts/SidebarLayout';
import BaseLayout from 'src/layouts/BaseLayout';

import SuspenseLoader from 'src/components/SuspenseLoader';
import RecentBrandsTable from 'src/content/applications/Brand/RecentBrandsTable';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

// Pages

const Overview = Loader(lazy(() => import('src/content/overview')));

// Dashboards


// Applications

const Category = Loader(
  lazy(() => import('src/content/applications/Category'))
);

const User = Loader(
  lazy(() => import('src/content/applications/User'))
);

const Order = Loader(
  lazy(() => import('src/content/applications/Order'))
);

const ApplicationsBrand = Loader(
  lazy(() => import('src/content/applications/Brand'))
);

const ApplicationsBanner = Loader(
  lazy(() => import('src/content/applications/Banner'))
);

const ApplicationsProduct = Loader(
  lazy(() => import('src/content/applications/Product'))
);

const ApplicationsSize = Loader(
  lazy(() => import('src/content/applications/Size'))
);

const ApplicationsColor = Loader(
  lazy(() => import('src/content/applications/Color'))
);

const ApplicationsMaterial = Loader(
  lazy(() => import('src/content/applications/Material'))
);

const ApplicationsProductDetail = Loader(
  lazy(() => import('src/content/applications/ProductDetail'))
);

const ApplicationsAddressbook = Loader(
  lazy(() => import('src/content/applications/AddressBook'))
);

const ApplicationsStaffOrder = Loader(
  lazy(() => import('src/content/applications/OrderStore'))
);

// Components

// Status

const Status404 = Loader(
  lazy(() => import('src/content/pages/Status/Status404'))
);

//login
const Login = Loader(lazy(() => import('src/content/pages/Login/Login')));

//ForgotPassword
const ForgotPassword = Loader(
  lazy(() => import('src/content/pages/ForgotPassword/ForgotPassword'))
);

const routes: RouteObject[] = [
  {
    path: '',
    element: <SidebarLayout />,
    children: []
  },
  {
    path: '',
    element: <BaseLayout />,
    children: [
      {
        path: '*',
        element: <Status404 />
      }
    ]
  },
  {
    path: 'statistical',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="amount" replace />
      }
    ]
  },
  {
    path: 'management',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="category" replace />
      },
      {
        path: 'category',
        element: <Category />
      },
      {
        path: 'user',
        element: <User />
      },
      {
        path: 'order',
        element: <Order />
      },
      {
        path: 'brands',
        element: <ApplicationsBrand />
      },
      {
        path: 'banner',
        element: <ApplicationsBanner />
      },
      {
        path: 'product',
        element: <ApplicationsProduct />
      },
      {
        path: 'size',
        element: <ApplicationsSize />
      },
      {
        path: 'color',
        element: <ApplicationsColor />
      },
      {
        path: 'material',
        element: <ApplicationsMaterial />
      },
      {
        path: 'product-detail',
        element: <ApplicationsProductDetail />
      },
      {
        path: 'address-book',
        element: <ApplicationsAddressbook />
      },
      {
        path: 'order-staff',
        element: <ApplicationsStaffOrder />
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            element: <Navigate to="details" replace />
          }
        ]
      },
      
    ]
  },

  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />
  }
];

export default routes;
