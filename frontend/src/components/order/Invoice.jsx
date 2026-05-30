import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";
import { useOrderDetailsQuery } from "../../redux/api/orderApi";
import "./Invoice.css";

const Invoice = () => {
  const params = useParams();
  const { data, isLoading, error } = useOrderDetailsQuery(params?.id);
  const order = data?.order || {};

  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    user,
    totalAmount,
    orderStatus,
    itemsPrice,
    taxAmount,
    shippingAmount,
  } = order;

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
  }, [error]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <MetaData title={"Order Invoice"} />
      <div className="invoice-container">
        <div className="invoice-header">
          <div className="invoice-header-left">
            <h1>INVOICE</h1>
            <p>Order #{order?._id}</p>
            <p>Date: {new Date(order?.createdAt).toLocaleDateString("en-US")}</p>
          </div>
          <div className="invoice-header-right">
            <h2>CollegeKart</h2>
            <p>College E-commerce Platform</p>
            <p>Email: support@collegekart.com</p>
          </div>
        </div>

        <div className="invoice-details">
          <div className="invoice-section">
            <h3>Bill To:</h3>
            <p><strong>{user?.name}</strong></p>
            <p>{user?.email}</p>
            <p>{shippingInfo?.phoneNo}</p>
          </div>

          <div className="invoice-section">
            <h3>Ship To:</h3>
            <p>{shippingInfo?.address}</p>
            <p>{shippingInfo?.city}, {shippingInfo?.zipCode}</p>
            <p>{shippingInfo?.country}</p>
          </div>

          <div className="invoice-section">
            <h3>Payment Info:</h3>
            <p><strong>Status:</strong> {paymentInfo?.status}</p>
            <p><strong>Method:</strong> {order?.paymentMethod}</p>
            <p><strong>Order Status:</strong> {orderStatus}</p>
          </div>
        </div>

        <div className="invoice-items">
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orderItems?.map((item, index) => (
                <tr key={index}>
                  <td>
                    <div className="item-details">
                      <img src={item?.image} alt={item?.name} width="50" />
                      <span>{item?.name}</span>
                    </div>
                  </td>
                  <td>${item?.price}</td>
                  <td>{item?.quantity}</td>
                  <td>${(item?.price * item?.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="invoice-summary">
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>${itemsPrice || totalAmount}</span>
          </div>
          {taxAmount && (
            <div className="summary-row">
              <span>Tax:</span>
              <span>${taxAmount}</span>
            </div>
          )}
          {shippingAmount && (
            <div className="summary-row">
              <span>Shipping:</span>
              <span>${shippingAmount}</span>
            </div>
          )}
          <div className="summary-row total">
            <span><strong>Total Amount:</strong></span>
            <span><strong>${totalAmount}</strong></span>
          </div>
        </div>

        <div className="invoice-footer no-print">
          <button onClick={handlePrint} className="btn btn-primary">
            <i className="fa fa-print"></i> Print Invoice
          </button>
        </div>

        <div className="invoice-footer-text">
          <p>Thank you for your business!</p>
          <p>If you have any questions, please contact us at support@collegekart.com</p>
        </div>
      </div>
    </>
  );
};

export default Invoice;
