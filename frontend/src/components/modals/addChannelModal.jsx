import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { useFormik } from 'formik';
import axios from 'axios';
import leoProfanity from 'leo-profanity';

import {
  getPressedAddChannel,
  setPressedAddChannel,
  setPressedChannel,
} from '../../slices/uiSlice';
import { getUserInfo } from '../../slices/userSlice';
import { channelsSelectors, addChannel } from '../../slices/channelSlice';
import setLocale, { getSchemaChannels } from '../../validation/validation';
import routes from '../../routes/routes';

const AddChannelModal = () => {
  const inputRef = useRef(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isPressedAddChannel = useSelector(getPressedAddChannel);
  const channels = useSelector(channelsSelectors.selectAll);
  const channelsNames = channels.map((channel) => channel.name);
  const [currentToken] = useSelector(getUserInfo);
  const handleClickCloseModal = ({ resetForm }) => {
    dispatch(setPressedAddChannel(false));
    resetForm();
  };

  setLocale(t);
  const schema = getSchemaChannels(channelsNames);

  const formik = useFormik({
    initialValues: {
      inputValue: '',
    },
    validationSchema: schema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values, { resetForm }) => {
      const currentValue = leoProfanity.clean(values.inputValue);
      const newChannel = { name: currentValue };
      try {
        const response = await axios.post(routes.channels(), newChannel, {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        });
        dispatch(addChannel(response.data));
        dispatch(setPressedChannel(+response.data.id));
        resetForm();
        handleClickCloseModal(formik);
        toast.success(t('channels.created'));
      } catch (e) {
        if (e.message === 'Network Error') {
          toast.error(t('errors.network'));
          return;
        }
        toast.error(t('errors.unknown'));
      }
    },
  });

  return (
    <Modal show={isPressedAddChannel} onHide={() => handleClickCloseModal(formik)} centered>
      <Modal.Header closeButton={!formik.isSubmitting}>
        <Modal.Title>{t('modals.add')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group>
            <Form.Label visuallyHidden htmlFor="inputValue">
              {t('modals.channelName')}
            </Form.Label>
            <Form.Control
              className="mb-2"
              type="text"
              name="inputValue"
              id="inputValue"
              ref={inputRef}
              required
              onChange={formik.handleChange}
              value={formik.values.inputValue}
              autoComplete="off"
              isInvalid={formik.errors.inputValue && formik.touched.inputValue}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.inputValue && formik.touched.inputValue
                ? formik.errors.inputValue
                : null}
            </Form.Control.Feedback>
            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                className="me-2"
                onClick={() => handleClickCloseModal(formik)}
                disabled={formik.isSubmitting}
              >
                {t('modals.cancel')}
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={formik.isSubmitting}
              >
                {t('modals.submit')}
              </Button>
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
export default AddChannelModal;
