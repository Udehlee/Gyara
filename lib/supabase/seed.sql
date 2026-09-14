insert into shipments (shipment_id, order_id, route_id, skus, due_date, estimated_arrival, status) values
('SC-2291', 'ORD-5510', 'R-01', ARRAY['TSH-RED-M', 'TSH-BLU-L'], '2026-09-08', '2026-09-05', 'in-transit'),
('SC-4432', 'ORD-5522', 'R-02', ARRAY['JKT-BLK-S'], '2027-03-01', '2027-02-20', 'in-transit'),
('SC-7810', 'ORD-5530', 'R-03', ARRAY['BAG-CANVAS-01'], '2026-09-10', '2026-09-03', 'in-transit');

insert into routes (route_id, origin, destination, status, alternate_route) values
('R-01', 'Apapa Port', 'Ikeja', 'clear', ARRAY['R-11']),
('R-11', 'Apapa Port', 'Ikeja', 'clear', ARRAY[]::text[]),
('R-02', 'Tin Can Island Port', 'Alaba International Market', 'clear', ARRAY['R-12']),
('R-12', 'Tin Can Island Port', 'Alaba International Market', 'clear', ARRAY[]::text[]),
('R-03', 'Apapa Port', 'Trade Fair Complex, Badagry Expressway', 'disrupted', ARRAY['R-13']),
('R-13', 'Apapa Port', 'Trade Fair Complex, Badagry Expressway', 'clear', ARRAY[]::text[]);

insert into suppliers (supplier_id, name, reliability_score, backup_supplier_id) values
('SUP-01', 'Balogun Textiles Ltd', 0.92, 'SUP-02'),
('SUP-02', 'Aswani Fabric Traders', 0.85, null);