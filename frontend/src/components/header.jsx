import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Container from 'react-bootstrap/Container';

import {
  selectorLoggedIn,
  setLoggedOut,
} from '../slices/userSlice';
import routes from '../routes/routes';

const Header = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectorLoggedIn);

  const classes = isLoggedIn ? 'd-block' : 'd-none';
  const handleLogOut = () => {
    dispatch(setLoggedOut());
  };

  return (
    <Navbar className="bg-white shadow-sm" expand="lg">
      <Container>
        <Navbar.Brand href={routes.mainPage()}>{t('hexletChat')}</Navbar.Brand>
        <ButtonGroup>
          <Button onClick={handleLogOut} className={classes}>
            {t('logout')}
          </Button>
        </ButtonGroup>
      </Container>
    </Navbar>
  );
};

export default Header;