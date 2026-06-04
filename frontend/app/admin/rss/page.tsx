'use client';

import { useEffect, useState } from "react";
import axios from "axios";

import {
  RefreshCw,
  CheckCircle,
  XCircle,
  Globe,
  MapPin,
  Calendar,
} from "lucide-react";

type Feed = {
  id: number;
  title: string;
  summary: string;
  city: string;
  category: string;
  source_name: string;
  image_url: string;
  link: string;
  author: string;
  relevance_score: number;
  approval_status: string;
  published_date: string;
  created_at: string;
};

const API_BASE = "http://localhost:8000";

export default function RSSPage() {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchingRSS, setFetchingRSS] = useState(false);

  const [statusFilter, setStatusFilter] =
    useState("pending");

  const [cityFilter, setCityFilter] =
    useState("all");

  useEffect(() => {
    loadFeeds();
  }, [statusFilter]);

  const loadFeeds = async () => {
    try {
      setLoading(true);

      let endpoint = `${API_BASE}/rss-feeds`;

      if (statusFilter !== "all") {
        endpoint =
          `${API_BASE}/rss-feeds/status/${statusFilter}`;
      }

      const response =
        await axios.get(endpoint);

      setFeeds(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRSS = async () => {
    try {
      setFetchingRSS(true);

      await axios.post(
        `${API_BASE}/rss-feeds/fetch`
      );

      await loadFeeds();
    } catch (error) {
      console.error(error);
    } finally {
      setFetchingRSS(false);
    }
  };

  const approveFeed = async (
    feedId: number
  ) => {
    try {
      await axios.put(
        `${API_BASE}/rss-feeds/${feedId}/approve`
      );

      loadFeeds();
    } catch (error) {
      console.error(error);
    }
  };

  const rejectFeed = async (
    feedId: number
  ) => {
    try {
      await axios.put(
        `${API_BASE}/rss-feeds/${feedId}/reject`
      );

      loadFeeds();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredFeeds =
    cityFilter === "all"
      ? feeds
      : feeds.filter(
          (feed) =>
            feed.city?.toLowerCase() ===
            cityFilter.toLowerCase()
        );

  return (
    <div className="p-8">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-8">

        <div>
          <h1 className="font-serif text-4xl text-forest-800">
            RSS Feed Review
          </h1>

          <p className="text-forest-500 mt-2">
            Review incoming travel articles
            before AI generation
          </p>
        </div>

        <button
          onClick={fetchRSS}
          disabled={fetchingRSS}
          className="btn-primary flex items-center gap-2"
        >
          <RefreshCw
            className={`w-4 h-4 ${
              fetchingRSS
                ? "animate-spin"
                : ""
            }`}
          />

          {fetchingRSS
            ? "Fetching..."
            : "Fetch RSS"}
        </button>
      </div>

      {/* STATUS FILTER */}

      <div className="flex flex-wrap gap-3 mb-4">

        {[
          "pending",
          "approved",
          "rejected",
          "all",
        ].map((status) => (
          <button
            key={status}
            onClick={() =>
              setStatusFilter(status)
            }
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${
                statusFilter === status
                  ? "bg-forest-700 text-white"
                  : "bg-white border border-gray-200"
              }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* CITY FILTER */}

      <div className="flex flex-wrap gap-3 mb-8">

        {[
          "all",
          "Amsterdam",
          "Paris",
          "Global",
        ].map((city) => (
          <button
            key={city}
            onClick={() =>
              setCityFilter(city)
            }
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${
                cityFilter === city
                  ? "bg-forest-600 text-white"
                  : "bg-white border border-gray-200"
              }`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* LOADING */}

      {loading && (
        <div className="text-center py-20">
          Loading feeds...
        </div>
      )}

      {/* EMPTY */}

      {!loading &&
        filteredFeeds.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
            No feeds found
          </div>
        )}

      {/* FEED GRID */}

      {!loading && (
        <div
          className="
            grid
            gap-8
            md:grid-cols-2
            xl:grid-cols-3
          "
        >
          {filteredFeeds.map((feed) => (
            <div
              key={feed.id}
              className="
                bg-white
                rounded-3xl
                overflow-hidden
                border
                border-stone-200
                shadow-sm
                hover:shadow-xl
                transition-all
              "
            >

              {/* IMAGE */}

              <img
                src={
                  feed.image_url ||
                  "https://placehold.co/600x400"
                }
                alt={feed.title}
                className="h-56 w-full object-cover"
              />

              {/* CONTENT */}

              <div className="p-6">

                <div className="flex gap-2 flex-wrap mb-4">

                  <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs">
                    {feed.city}
                  </span>

                  <span className="px-2 py-1 rounded-full bg-green-50 text-green-700 text-xs">
                    {feed.source_name}
                  </span>

                  <span className="px-2 py-1 rounded-full bg-purple-50 text-purple-700 text-xs">
                    Score {feed.relevance_score}
                  </span>

                </div>

                <h2 className="font-serif text-xl text-forest-800 line-clamp-2">
                  {feed.title}
                </h2>

                <p className="text-sm text-gray-600 mt-3 line-clamp-4">
                  {feed.summary}
                </p>

                <div className="mt-5 space-y-2 text-xs text-gray-500">

                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3" />
                    {feed.city}
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    {new Date(
                      feed.published_date
                    ).toLocaleDateString()}
                  </div>

                </div>

                <a
                  href={feed.link}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    flex
                    items-center
                    gap-2
                    mt-4
                    text-forest-600
                    text-sm
                  "
                >
                  <Globe className="w-4 h-4" />
                  View Original Article
                </a>

                {feed.approval_status ===
                  "pending" && (
                  <div className="flex gap-3 mt-6">

                    <button
                      onClick={() =>
                        approveFeed(feed.id)
                      }
                      className="
                        flex-1
                        bg-green-600
                        hover:bg-green-700
                        text-white
                        rounded-xl
                        py-2
                        flex
                        items-center
                        justify-center
                        gap-2
                      "
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        rejectFeed(feed.id)
                      }
                      className="
                        flex-1
                        bg-red-500
                        hover:bg-red-600
                        text-white
                        rounded-xl
                        py-2
                        flex
                        items-center
                        justify-center
                        gap-2
                      "
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>

                  </div>
                )}

                {feed.approval_status !==
                  "pending" && (
                  <div className="mt-6">

                    <span
                      className={`
                        px-3 py-2 rounded-xl text-sm font-medium
                        ${
                          feed.approval_status ===
                          "approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }
                      `}
                    >
                      {feed.approval_status}
                    </span>

                  </div>
                )}

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}