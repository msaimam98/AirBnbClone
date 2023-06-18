import { React } from 'react';
import { AiFillStar } from 'react-icons/ai'
import './cardstyles.css';

export const RenderStarRating = (props) => {
  const {
    rating
  } = props;

  return (
    <div className="upper-right">
      <AiFillStar className='reacticon'></AiFillStar>{ rating } stars
    </div>
  )
}