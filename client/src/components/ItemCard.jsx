import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import { getImageUrl } from '../utils/imageUtils';
import { memo } from 'react';

const ItemCard = memo(({ item }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full group">
            <div className="relative h-56 overflow-hidden bg-gray-100">
                {item.images && item.images.length > 0 ? (
                    <img
                        src={getImageUrl(item.images[0])}
                        alt={item.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <svg className="w-12 h-12 mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs font-medium uppercase tracking-wider">No Image</span>
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase text-white shadow-sm ${item.type === 'LOST' ? 'bg-red-500' : 'bg-green-500'}`}>
                        {item.type}
                    </span>
                    {item.isSuspicious && (
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase text-white bg-orange-500 animate-pulse shadow-sm">
                            SUSPICIOUS
                        </span>
                    )}
                </div>

                <div className="absolute bottom-3 right-3 z-10">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold bg-white/90 backdrop-blur-sm text-gray-700 shadow-sm border border-gray-100 uppercase tracking-tighter`}>
                        {item.category}
                    </span>
                </div>
            </div>

            <div className="p-4 md:p-5 flex flex-col flex-grow">
                <h3 className="text-base md:text-lg font-bold text-gray-800 line-clamp-1 group-hover:text-primary transition-colors mb-1 md:mb-2">{item.title}</h3>

                <p className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4 line-clamp-2 flex-grow leading-relaxed">
                    {item.description}
                </p>

                <div className="space-y-1.5 md:space-y-2 mt-auto pt-3 md:pt-4 border-t border-gray-50">
                    <div className="flex items-center text-[10px] md:text-[11px] text-gray-500">
                        <FaMapMarkerAlt className="mr-2 text-primary/60" />
                        <span className="truncate">{item.location}</span>
                    </div>
                    <div className="flex items-center text-[10px] md:text-[11px] text-gray-500">
                        <FaCalendarAlt className="mr-2 text-primary/60" />
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                </div>

                <Link to={`/items/${item._id}`} className="mt-4 block w-full text-center bg-gray-50 text-gray-700 py-2 md:py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all duration-300 border border-gray-100">
                    View Details
                </Link>
            </div>
        </div>
    );
});

export default ItemCard;
