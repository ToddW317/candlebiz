import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment } from '@fortawesome/free-solid-svg-icons';

interface InstagramPost {
  id: string;
  image: string;
  likes: number;
  comments: number;
}

const InstagramPost = ({ post }: { post: InstagramPost }) => {
  return (
    <div className="relative group">
      <div className="relative aspect-square">
        <Image
          src={post.image}
          alt="Instagram post"
          fill
          className="object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-lg">
          <div className="flex items-center space-x-6 text-white">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faHeart} className="h-5 w-5 mr-2" />
              <span>{post.likes}</span>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faComment} className="h-5 w-5 mr-2" />
              <span>{post.comments}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PopularProducts = () => {
  const posts: InstagramPost[] = [
    { id: '1', image: '/instagram-1.jpg', likes: 120, comments: 15 },
    { id: '2', image: '/instagram-2.jpg', likes: 342, comments: 23 },
    { id: '3', image: '/instagram-3.jpg', likes: 453, comments: 42 },
    { id: '4', image: '/instagram-4.jpg', likes: 234, comments: 19 },
  ];

  return (
    <section className="py-20 px-4 bg-[#F5EBE6]">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <p className="text-gray-600 uppercase tracking-wide mb-4">DRIED FLOWER COLLECTION</p>
          <h2 className="text-4xl font-serif">See What's Popular</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 pt-20">
          {posts.map((post) => (
            <InstagramPost key={post.id} post={post} />
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-gray-800 px-8 py-3 rounded-full hover:bg-gray-50 transition-colors"
          >
            FOLLOW US ON INSTAGRAM
          </a>
        </div>
      </div>
    </section>
  );
};

export default PopularProducts; 