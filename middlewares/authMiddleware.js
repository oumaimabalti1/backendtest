const jwt = require('jsonwebtoken');

// ✅ Vérifier que l'utilisateur est connecté
exports.protect = async (req, res, next) => {
    try {
        let token;
        
        // Extraire le token du header Authorization
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        
        // Vérifier si le token existe
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'Non autorisé - Pas de token' 
            });
        }
        
        // Vérifier et décoder le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Ajouter les infos de l'utilisateur à req
        req.user = decoded;  // { id: '...', role: '...' }
        
        next();
        
    } catch (error) {
        res.status(401).json({ 
            success: false,
            message: 'Token invalide ou expiré' 
        });
    }
};

// ✅ Vérifier le rôle de l'utilisateur
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false,
                message: `Accès refusé - Role ${req.user.role} non autorisé` 
            });
        }
        next();
    };
};
