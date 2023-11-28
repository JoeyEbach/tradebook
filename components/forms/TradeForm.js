/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
// eslint-disable-next-line import/no-extraneous-dependencies
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// eslint-disable-next-line import/no-extraneous-dependencies
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import firebase from 'firebase/app';
import { FloatingLabel } from 'react-bootstrap';
import { useAuth } from '../../utils/context/authContext';
import { newTrade, updateTrade } from '../../api/trades';
import { clientCredentials } from '../../utils/client';
import {
  deleteTradeImage, newTradeImage, updateTradeImage, viewTradeImage,
} from '../../api/tradeImages';

const initialState = {
  asset: '',
  date: '',
  entry: '',
  favorite: false,
  stop: '',
  status: '',
  target: '',
  notes: '',
};
function TradeForm({ tradeObj }) {
  const router = useRouter();
  const { firebaseKey } = router.query;
  const [formInput, setFormInput] = useState({ ...initialState, strategyId: firebaseKey });
  const [images, setImages] = useState(null);
  const [tradeObjImages, setTradeObjImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [show, setShow] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [msg, setMsg] = useState(null);
  const { user } = useAuth();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const endpoint = clientCredentials.storageBucket;
  const storageRef = firebase.storage().ref(`${endpoint}/images`);

  const fileUploadHandler = () => {
    if (!images) {
      setMsg('No file selected');
    } const payload = images;

    setMsg('Uploading...');
    storageRef.put(payload).then(async (snapshot) => {
      setMsg('Upload successful!');
      const downloadURL = await snapshot.ref.getDownloadURL();
      setImages(null);
      setShowUpload(false);
      const imgPayload = {
        image: downloadURL,
      };
      newTradeImage(imgPayload).then(({ name }) => {
        const patchPayload = { firebaseKey: name };
        updateTradeImage(patchPayload).then(() => {
          viewTradeImage(name)?.then((image) => setUploadedImages((prevState) => [...prevState, image]));
        });
      });
    });
  };

  const deleteImageHandler = (type, fbKey) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      viewTradeImage(fbKey).then(() => {
        if (type === 'old') {
          const filterArray = tradeObjImages.filter((img) => img.firebaseKey !== fbKey);
          setTradeObjImages(filterArray);
        } else {
          const filteredArray = uploadedImages.filter((obj) => obj.firebaseKey !== fbKey);
          setUploadedImages(filteredArray);
        }
        setMsg(null);
        deleteTradeImage(fbKey);
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tradeObj.firebaseKey) {
      const filteredFormInput = delete formInput.images;
      updateTrade(filteredFormInput).then(() => {
        if (uploadedImages) {
          uploadedImages.forEach((img) => {
            updateTradeImage({ firebaseKey: img.firebaseKey, tradeId: tradeObj.firebaseKey });
          });
        }
      }).then(() => router.push(`/strategies/${tradeObj.strategyId}`));
    } else {
      const payload = { ...formInput, uid: user.uid };
      newTrade(payload).then(({ name }) => {
        const patchPayload = { firebaseKey: name };
        updateTrade(patchPayload);

        uploadedImages.forEach((img) => {
          updateTradeImage({ firebaseKey: img.firebaseKey, tradeId: name }).then(() => router.push(`/strategies/${formInput.strategyId}`));
        });
      });
    }
  };

  useEffect(() => {
    if (tradeObj.firebaseKey) {
      setTradeObjImages(tradeObj.images);
      setFormInput(tradeObj);
    }
  }, [tradeObj]);

  return (
    <div className="tradeFormCont">
      <Form className="tradeForm" onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Asset Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Asset Name"
            name="asset"
            value={formInput.asset}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Date of Trade"
            name="date"
            value={formInput.date}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Entry</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Your Entry Price"
            name="entry"
            value={formInput.entry}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Target</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Your Target Price"
            name="target"
            value={formInput.target}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Stop %</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Your Stop Percentage"
            name="stop"
            value={formInput.stop}
            onChange={handleChange}
          />
        </Form.Group>

        <FloatingLabel controlId="floatingSelect" label="Trade Status">
          <Form.Select
            aria-label="Trade Status"
            name="status"
            onChange={handleChange}
            className="mb-3"
            value={formInput.status}
            required
          >
            <option value="">Select the Trade Status</option>
            <option>Win</option>
            <option>Loss</option>
            <option>Break Even</option>
            <option>Undecided</option>
          </Form.Select>
        </FloatingLabel>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <FloatingLabel>Trade Notes</FloatingLabel>
          <Form.Control
            type="textarea"
            placeholder="Enter Trade Notes"
            name="notes"
            value={formInput.notes}
            onChange={handleChange}
          />
        </Form.Group>

        <div
          className="modal show"
          style={{ display: 'block', position: 'initial' }}
        >
          <Button variant="primary" onClick={handleShow}>
            {tradeObjImages ? 'Edit Images' : 'Add Images'}
          </Button>
          <div className="imgGlimpses">
            {tradeObjImages && tradeObjImages.map((item) => (
              <img key={item.firebaseKey} className="imgGlimpse" src={item.image} alt={formInput.asset} />
            ))}
            {uploadedImages && uploadedImages.map((item) => (
              <img key={item.firebaseKey} className="imgGlimpse" src={item.image} alt={formInput.asset} />
            ))}
          </div>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Add Your Trade Images</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Control
                  type="file"
                  onChange={(event) => {
                    setImages(event.target.files[0]);
                    setShowUpload(true);
                    setMsg('Upload file?');
                  }}
                />
              </Form.Group>
              {showUpload && <Button variant="outline-primary" size="sm" type="button" onClick={fileUploadHandler}>Upload</Button>}
              { msg && <span>{msg}</span>}
              {tradeObjImages && tradeObjImages.map((item) => (
                <div key={item.firebaseKey}>
                  <div className="ulSnapshots">
                    <img key={item.firebaseKey} className="snapShot" src={item.image} alt={formInput.asset} />
                  </div>
                  <div className="deleteSnapshot">
                    <Button
                      type="button"
                      onClick={() => {
                        deleteImageHandler('old', item.firebaseKey);
                      }}
                      key={item.firebaseKey}
                      className="deleteImg"
                      variant="outline-dark"
                      size="sm"
                    >Delete
                    </Button>
                  </div>
                </div>
              ))}
              {uploadedImages && uploadedImages.map((item) => (
                <div key={item.firebaseKey}>
                  <div className="ulSnapshots">
                    <img key={item.firebaseKey} className="snapShot" src={item.image} alt={formInput.asset} />
                  </div>
                  <div className="deleteSnapshot">
                    <Button
                      type="button"
                      onClick={() => {
                        deleteImageHandler('new', item.firebaseKey);
                      }}
                      key={item.firebaseKey}
                      className="deleteImg"
                      variant="outline-dark"
                      size="sm"
                    >Delete
                    </Button>
                  </div>
                </div>
              ))}
              <FontAwesomeIcon icon={faSquarePlus} />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={handleClose}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check
            type="switch"
            label="Favorite"
            name="favorite"
            checked={formInput.favorite}
            onChange={(e) => {
              setFormInput((prevState) => ({
                ...prevState,
                favorite: e.target.checked,
              }));
            }}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          {tradeObj.firebaseKey ? 'Update Trade' : '+ New Trade'}
        </Button>
      </Form>
    </div>
  );
}

TradeForm.propTypes = {
  tradeObj: PropTypes.shape({
    asset: PropTypes.string,
    date: PropTypes.string,
    firebaseKey: PropTypes.string,
    entry: PropTypes.string,
    favorite: PropTypes.bool,
    uid: PropTypes.string,
    stop: PropTypes.string,
    status: PropTypes.string,
    target: PropTypes.string,
    notes: PropTypes.string,
    strategyId: PropTypes.string,
    images: PropTypes.shape({
      firebaseKey: PropTypes.string,
      image: PropTypes.string,
      tradeId: PropTypes.string,
    }),
  }),

};
TradeForm.defaultProps = {
  tradeObj: initialState,
};

export default TradeForm;
