import React, { Component } from "react";
import { Card, CardImg, CardText, CardBody, CardTitle, Breadcrumb, BreadcrumbItem,
	 Button, Modal, ModalHeader, ModalBody, Row, Label } from 'reactstrap';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Link } from 'react-router-dom';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';

const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);

	class CommentForm extends Component {
		constructor(props) {
			super(props);
		  
			this.state = {
				isModalOpen: false
			};
		
			this.toggleModal = this.toggleModal.bind(this);
			this.handleSubmit = this.handleSubmit.bind(this);
	}

	toggleModal() {
        this.setState({
          isModalOpen: !this.state.isModalOpen
        });
    }

	handleSubmit(values) {
        console.log('Current State is: ' + JSON.stringify(values));
		this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
    }

	render (){
		return (
			<div>
      			<Button outline onClick={this.toggleModal}><span className="fa fa-pencil fa-lg"></span> Submit Comment</Button>
				<Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                    <ModalBody className="mr-2 ml-2">
                        <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
							<Row className="form-group">
								<Label htmlFor="rating">Rating</Label>
								<Control.select model=".rating" name="rating"
									className="form-control">
									<option>1</option>
									<option>2</option>
									<option>3</option>
									<option>4</option>
									<option>5</option>
								</Control.select>
                            </Row>
                            <Row className="form-group">
								<Label htmlFor="author">Your Name</Label>
								<Control.text model=".author" id="author" name="author"
									placeholder="Your Name"
									className="form-control"
									validators={{minLength: minLength(3), maxLength: maxLength(15)}}
								/>
								<Errors
									className="text-danger"
									model=".author"
									show="touched"
									messages={{
										minLength: 'Must be greater than 2 characters',
										maxLength: 'Must be 15 characters or less'
									}}
                                />
                            </Row>
                            <Row className="form-group">
							<Label htmlFor="comment">Comment</Label>
								<Control.textarea model=".comment" id="comment" name="comment"
									rows="6"
									className="form-control" 
								/>
                            </Row>
                            <Row className="form-group">
                                <Button type="submit" color="primary">Submit</Button>
                            </Row>
                        </LocalForm>
                    </ModalBody>
                </Modal>
			</div>
		)
	}
}

	function RenderComments({comments, postComment, dishId}) {
        if (comments != null) {
            const commentsList = comments.map(review => {
                return (
                    <li key = {review.id}>
                        <p>{review.comment}</p> 
                        <p>-- {review.author} , {new Intl.DateTimeFormat("en-US", {year: "numeric", month: "short", day: "2-digit"}).format(new Date(Date.parse(review.date)))}</p>
                    </li>
                );
            });
            return (
				<React.Fragment>
                    <h4>Comments</h4>
					<ul className="list-unstyled">
						{commentsList}
					</ul>
					<CommentForm dishId={dishId} postComment={postComment} />
				</React.Fragment>
            );
		}
		else
			return (
				<div></div>
			);
    }

	function RenderDish({dish}) {
        if (dish != null) {
            return (
				<Card>
					<CardImg top src={baseUrl + dish.image} alt={dish.name} />
					<CardBody>
						<CardTitle><h5>{dish.name}</h5></CardTitle>
						<CardText>{dish.description}</CardText>
					</CardBody>
				</Card>
            );
		}
		else {
            return (
                <div></div>
            );
        }
    }

	const DishDetail = (props) => {
		if (props.isLoading) {
            return(
                <div className="container">
                    <div className="row">            
                        <Loading />
                    </div>
                </div>
            );
        }
        else if (props.errMess) {
            return(
                <div className="container">
                    <div className="row">            
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            );
        }
        else if (props.dish != null)  {
			return (
                <div className="container">
					<div className="row">
						<Breadcrumb>
							<BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
							<BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
						</Breadcrumb>
						<div className="col-12">
							<h3>{props.dish.name}</h3>
							<hr />
						</div>                
					</div>
					<div className="row">
						<div className="col-12 col-md-5 m-1">
							<RenderDish dish={props.dish} />
						</div>
						<div className="col-12 col-md-5 m-1">
						<RenderComments comments={props.comments}
							postComment={props.postComment}
							dishId={props.dish.id}
						/>
						</div>
					</div>
                </div>
            );
		} 
		else 
			return (
				<div></div>
			);
	}

export default DishDetail;