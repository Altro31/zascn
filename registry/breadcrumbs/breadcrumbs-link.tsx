import React from "react";
import Link from "next/link";

type BreadcrumbItem = {
    label: string;
    href?: string;
};

type BreadcrumbLinksProps = {
    items: BreadcrumbItem[];
};

const BreadcrumbLinks: React.FC<BreadcrumbLinksProps> = ({ items }) => {
    return (
        <div className="panel !py-3">
            <nav className="flex" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    {items.map((item, idx) => (
                        <li key={idx} className="inline-flex items-center">
                            {item.href ? (
                                <Link
                                    href={item.href}
                                    className="text-gray-700 hover:text-primary inline-flex items-center"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <div className="flex items-center">
                                    <svg
                                        className="w-6 h-6 text-gray-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                    <span className="text-gray-500 ml-1 md:ml-2 text-sm font-medium">
                                        {item.label}
                                    </span>
                                </div>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>
        </div>
    );
};

export default BreadcrumbLinks;