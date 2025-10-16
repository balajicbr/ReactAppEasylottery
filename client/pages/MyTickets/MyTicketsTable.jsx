import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyTicketsTable.css';

const MyTicketsTable = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'grid' or 'list'
  const [expandAll, setExpandAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState({
    '30-july-2025-random': true,
    '30-july-2025-choose-1': false,
    '30-july-2025-choose-2': false
  });
  const [sortConfig, setSortConfig] = useState({
    column: null,
    direction: 'asc'
  });

  const handleBack = () => {
    navigate(-1);
  };

  const handleGridView = () => {
    navigate('/my-tickets');
  };

  const toggleExpandAll = () => {
    const newExpandState = !expandAll;
    setExpandAll(newExpandState);
    
    const newExpandedRows = {};
    Object.keys(expandedRows).forEach(key => {
      newExpandedRows[key] = newExpandState;
    });
    setExpandedRows(newExpandedRows);
  };

  const toggleRowExpansion = (rowId) => {
    setExpandedRows(prev => ({
      ...prev,
      [rowId]: !prev[rowId]
    }));
  };

  const handleSort = (column) => {
    setSortConfig(prev => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const tableData = [
    {
      id: '30-july-2025-random',
      date: '30 July 2025',
      type: 'Random Ticket',
      isExpandable: true,
      hasDetails: true,
      tickets: [
        { number: '0291', qrCode: 'https://api.builder.io/api/v1/image/assets/TEMP/a7682e51b0406d3be610fbf509d301268179bb70?width=64' },
        { number: '8115', qrCode: 'https://api.builder.io/api/v1/image/assets/TEMP/a7682e51b0406d3be610fbf509d301268179bb70?width=64' }
      ]
    },
    {
      id: '30-july-2025-choose-1',
      date: '30 July 2025',
      type: 'Choose Your Own Number',
      isExpandable: true,
      hasDetails: false,
      tickets: []
    },
    {
      id: '30-july-2025-choose-2',
      date: '30 July 2025',
      type: 'Choose Your Own Number',
      isExpandable: true,
      hasDetails: false,
      tickets: []
    }
  ];

  return (
    <div className="my-tickets-table-container">
      {/* Background Blur Effect */}
      <div className="background-blur-effect"></div>

      {/* Ticket Summary Card */}
      <div className="ticket-summary-card">
        <img className="daywin-logo" src="https://api.builder.io/api/v1/image/assets/TEMP/9f832b9263a0138420ab90a8b96759a948c1cc3e?width=207" alt="DAYWIN Logo" />
        <div className="summary-details">
          <div className="status-badge drawn">Drawn</div>
          <div className="ticket-count">
            <span className="count-label">Total Tickets</span>
            <div className="count-badge">
              <span className="count-number">2</span>
            </div>
          </div>
        </div>
        <div className="summary-footer">
          <span className="date-label">Draw Date:</span>
          <span className="date-value">30 July 2025</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Search and Controls */}
        <div className="search-controls-section">
          <div className="search-controls">
            <div className="search-input">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M17.5 17.5L13.8833 13.8833" stroke="#270659" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z" stroke="#270659" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="control-buttons">
              <button className="filter-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M3 6H21" stroke="#270659" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 12H17" stroke="#270659" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 18H14" stroke="#270659" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <div className="view-toggle">
                <button className="view-btn" onClick={handleGridView}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 3H4C3.44772 3 3 3.44772 3 4V9C3 9.55228 3.44772 10 4 10H9C9.55228 10 10 9.55228 10 9V4C10 3.44772 9.55228 3 9 3Z" stroke="#270659" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20 3H15C14.4477 3 14 3.44772 14 4V9C14 9.55228 14.4477 10 15 10H20C20.5523 10 21 9.55228 21 9V4C21 3.44772 20.5523 3 20 3Z" stroke="#270659" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20 14H15C14.4477 14 14 14.4477 14 15V20C14 20.5523 14.4477 21 15 21H20C20.5523 21 21 20.5523 21 20V15C21 14.4477 20.5523 14 20 14Z" stroke="#270659" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 14H4C3.44772 14 3 14.4477 3 15V20C3 20.5523 3.44772 21 4 21H9C9.55228 21 10 20.5523 10 20V15C10 14.4477 9.55228 14 9 14Z" stroke="#270659" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button className="view-btn view-btn-active">
                  <div className="list-view-active">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M3 12H3.01" stroke="#270659" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 18H3.01" stroke="#270659" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 6H3.01" stroke="#270659" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 12H21" stroke="#270659" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 18H21" stroke="#270659" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 6H21" stroke="#270659" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Expand All Toggle */}
          <div className="expand-all-toggle" onClick={toggleExpandAll}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d={expandAll ? "M12 12C12 13.6569 10.6569 15 9 15C7.34315 15 6 13.6569 6 12C6 10.3431 7.34315 9 9 9C10.6569 9 12 10.3431 12 12Z" : "M18 12C18 13.6569 16.6569 15 15 15C13.3431 15 12 13.6569 12 12C12 10.3431 13.3431 9 15 9C16.6569 9 18 10.3431 18 12Z"} fill="#270659" stroke="#270659" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 5H9C5.13401 5 2 8.13401 2 12C2 15.866 5.13401 19 9 19H15C18.866 19 22 15.866 22 12C22 8.13401 18.866 5 15 5Z" stroke="#270659" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Expand All</span>
          </div>
        </div>

        {/* Table */}
        <div className="tickets-table">
          <div className="table-container">
            {/* Table Header */}
            <div className="table-header">
              <div className="header-column date-column">
                <button className="sort-button" onClick={() => handleSort('date')}>
                  <span>Date of Purchase</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5.8335 12.5L10.0002 16.6667L14.1668 12.5" stroke="#270659" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5.8335 7.5L10.0002 3.33334L14.1668 7.5" stroke="#270659" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              <div className="header-column type-column">
                <button className="sort-button" onClick={() => handleSort('type')}>
                  <span>Type</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5.8335 12.5L10.0002 16.6667L14.1668 12.5" stroke="#270659" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5.8335 7.5L10.0002 3.33334L14.1668 7.5" stroke="#270659" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Table Body */}
            <div className="table-body">
              {/* First Row - Expandable with details */}
              <div className="table-row expandable" onClick={() => toggleRowExpansion('30-july-2025-random')}>
                <div className="row-cell date-cell">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`expand-icon ${expandedRows['30-july-2025-random'] ? 'expanded' : ''}`}>
                    <path d="M12 10L8 6L4 10" stroke="#270659" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>30 July 2025</span>
                </div>
                <div className="row-cell type-cell">
                  <span>Random Ticket</span>
                </div>
              </div>

              {/* Expanded content for first row */}
              {expandedRows['30-july-2025-random'] && (
                <div className="expanded-section">
                  <div className="sub-header">
                    <div className="sub-header-cell">Ticket Number</div>
                    <div className="sub-header-cell">QR Code</div>
                  </div>
                  <div className="ticket-detail-row">
                    <div className="detail-cell ticket-number-cell">
                      <span>0291</span>
                    </div>
                    <div className="detail-cell qr-cell">
                      <img src="https://api.builder.io/api/v1/image/assets/TEMP/a7682e51b0406d3be610fbf509d301268179bb70?width=64" alt="QR Code" className="qr-code-image" />
                    </div>
                  </div>
                  <div className="ticket-detail-row">
                    <div className="detail-cell ticket-number-cell">
                      <span>8115</span>
                    </div>
                    <div className="detail-cell qr-cell">
                      <img src="https://api.builder.io/api/v1/image/assets/TEMP/a7682e51b0406d3be610fbf509d301268179bb70?width=64" alt="QR Code" className="qr-code-image" />
                    </div>
                  </div>
                </div>
              )}

              {/* Second Row - Expandable without details */}
              <div className="table-row expandable" onClick={() => toggleRowExpansion('30-july-2025-choose-1')}>
                <div className="row-cell date-cell">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`expand-icon ${expandedRows['30-july-2025-choose-1'] ? 'expanded' : ''}`}>
                    <path d="M12 6L8 10L4 6" stroke="#270659" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>30 July 2025</span>
                </div>
                <div className="row-cell type-cell">
                  <span>Choose Your Own Number</span>
                </div>
              </div>

              {/* Third Row - Expandable without details */}
              <div className="table-row expandable" onClick={() => toggleRowExpansion('30-july-2025-choose-2')}>
                <div className="row-cell date-cell">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`expand-icon ${expandedRows['30-july-2025-choose-2'] ? 'expanded' : ''}`}>
                    <path d="M12 6L8 10L4 6" stroke="#270659" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>30 July 2025</span>
                </div>
                <div className="row-cell type-cell">
                  <span>Choose Your Own Number</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <span className="pagination-label">Page</span>
          <div className="page-select">
            <div className="select-field">
              <span className="page-number">{currentPage}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 6L8 10L12 6" stroke="#270659" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <span className="pagination-total">of 10</span>
        </div>
      </div>

      {/* Floating Phone Button */}
      <div className="floating-phone-btn">
        <div className="fab-inner">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M13.832 16.568C14.0385 16.6628 14.2712 16.6845 14.4917 16.6294C14.7122 16.5744 14.9073 16.4458 15.045 16.265L15.4 15.8C15.5863 15.5516 15.8279 15.35 16.1056 15.2111C16.3833 15.0723 16.6895 15 17 15H20C20.5304 15 21.0391 15.2107 21.4142 15.5858C21.7893 15.9609 22 16.4696 22 17V20C22 20.5304 21.7893 21.0391 21.4142 21.4142C21.0391 21.7893 20.5304 22 20 22C15.2261 22 10.6477 20.1036 7.27208 16.7279C3.89642 13.3523 2 8.7739 2 4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H7C7.53043 2 8.03914 2.21071 8.41421 2.58579C8.78929 2.96086 9 3.46957 9 4V7C9 7.31049 8.92771 7.61672 8.78885 7.89443C8.65 8.17214 8.44839 8.41371 8.2 8.6L7.732 8.951C7.54842 9.09118 7.41902 9.29059 7.36579 9.51535C7.31256 9.74012 7.33878 9.97638 7.44 10.184C8.80668 12.9599 11.0544 15.2048 13.832 16.568Z" stroke="#270659" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default MyTicketsTable;
