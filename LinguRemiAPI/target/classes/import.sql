INSERT INTO Usuarios (nome_Usuarios, email_Usuarios, senha_Usuarios, telefone_Usuarios)VALUES ('Giovanni França', 'giovanni@email.com', '12345', '11988887777');
INSERT INTO Usuarios (nome_Usuarios, email_Usuarios, senha_Usuarios, telefone_Usuarios)VALUES ('Maria Oliveira', 'maria.oliveira@email.com', 'abcde', '11999996666');
INSERT INTO Usuarios (nome_Usuarios, email_Usuarios, senha_Usuarios, telefone_Usuarios)VALUES ('Carlos Santos', 'carlos.santos@email.com', 'senha123', '11977778888');

INSERT INTO Historico (id_Usuarios, email_Transferencia, valor_Transferencia, data_Transferencia, desc_Transferencia) VALUES (1, 'maria.oliveira@email.com', 150.00, '2025-10-08T14:30:00Z', 'Transferência para Maria');
INSERT INTO Historico (id_Usuarios, email_Transferencia, valor_Transferencia, data_Transferencia, desc_Transferencia) VALUES (1, 'carlos.santos@email.com', 50.00, '2025-10-07T09:15:00Z', 'Almoço dividido');
INSERT INTO Historico (id_Usuarios, email_Transferencia, valor_Transferencia, data_Transferencia, desc_Transferencia) VALUES (2, 'giovanni@email.com', 200.00, '2025-10-06T18:00:00Z', 'Pagamento de serviço');
INSERT INTO Historico (id_Usuarios, email_Transferencia, valor_Transferencia, data_Transferencia, desc_Transferencia) VALUES (3, 'maria.oliveira@email.com', 75.50, '2025-10-05T12:00:00Z', 'Compra compartilhada');

INSERT INTO Receitas (nome_Receitas, descricao_Receitas, valor_Receitas, img_Receitas) VALUES ('Salada Caesar', 'Salada clássica com alface romana, frango grelhado e molho caesar.', 25.90,'C:\Users\Giovanni\Desktop\LinguRemi\uploads\doce3');
INSERT INTO Receitas (nome_Receitas, descricao_Receitas, valor_Receitas, img_Receitas) VALUES('Lasanha Bolonhesa', 'Lasanha artesanal com massa fresca, molho bolonhesa e queijo gratinado.', 38.50,'C:\Users\Giovanni\Desktop\LinguRemi\uploads\doce1');
INSERT INTO Receitas (nome_Receitas, descricao_Receitas, valor_Receitas, img_Receitas) VALUES('Risoto de Cogumelos', 'Risoto cremoso preparado com cogumelos frescos e parmesão.', 42.00,'C:\Users\Giovanni\Desktop\LinguRemi\uploads\doce2');
INSERT INTO Receitas (nome_Receitas, descricao_Receitas, valor_Receitas, img_Receitas) VALUES('Filé ao Molho Madeira', 'Filé mignon grelhado com molho madeira e acompanhamentos.', 54.90,'C:\Users\Giovanni\Desktop\LinguRemi\uploads\doce1');
INSERT INTO Receitas (nome_Receitas, descricao_Receitas, valor_Receitas, img_Receitas) VALUES('Cheesecake de Frutas Vermelhas', 'Sobremesa cremosa com calda de frutas vermelhas.', 18.75,'C:\Users\Giovanni\Desktop\LinguRemi\uploads\doce2');